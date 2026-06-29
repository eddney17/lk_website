import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PRODUCT_TEMPLATES,
  TextLayer,
} from './customize-item.types';
import { DEFAULT_FONT_FAMILY, FONT_OPTIONS } from './customize-item.fonts';

interface DragState {
  layerId: string;
  offsetX: number;
  offsetY: number;
}

@Component({
  selector: 'app-customize-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customize-item.html',
  styleUrls: ['./customize-item.scss', './customize-item.fonts.scss'],
})
export class CustomizeItem {
  private readonly platformId = inject(PLATFORM_ID);

  readonly productTemplates = PRODUCT_TEMPLATES;
  readonly fontOptions = FONT_OPTIONS;

  readonly selectedProductId = signal(PRODUCT_TEMPLATES[0].id);
  readonly textLayers = signal<TextLayer[]>([]);
  readonly selectedLayerId = signal<string | null>(null);
  readonly canvasSize = signal({ width: 0, height: 0 });
  readonly isDownloading = signal(false);
  readonly productDropdownOpen = signal(false);

  readonly selectedTemplate = computed(
    () =>
      this.productTemplates.find((t) => t.id === this.selectedProductId()) ??
      this.productTemplates[0],
  );

  readonly selectedLayer = computed(() =>
    this.textLayers().find((l) => l.id === this.selectedLayerId()) ?? null,
  );

  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLElement>;
  @ViewChild('canvasImage') canvasImage!: ElementRef<HTMLImageElement>;

  private dragState: DragState | null = null;
  private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private readonly onPointerUp = () => this.endDrag();

  selectProduct(id: string): void {
    this.productDropdownOpen.set(false);
    if (id === this.selectedProductId()) {
      return;
    }
    this.selectedProductId.set(id);
    this.textLayers.set([]);
    this.selectedLayerId.set(null);
  }

  toggleProductDropdown(event: Event): void {
    event.stopPropagation();
    this.productDropdownOpen.update((open) => !open);
  }

  @HostListener('document:click')
  closeProductDropdown(): void {
    this.productDropdownOpen.set(false);
  }

  onCanvasImageLoad(): void {
    this.updateCanvasSize();
  }

  updateCanvasSize(): void {
    if (!this.canvasContainer?.nativeElement) {
      return;
    }
    const el = this.canvasContainer.nativeElement;
    this.canvasSize.set({ width: el.clientWidth, height: el.clientHeight });
  }

  addText(): void {
    const size = this.canvasSize();
    const layer: TextLayer = {
      id: crypto.randomUUID(),
      content: 'Your text',
      x: size.width / 2 || 200,
      y: size.height / 2 || 150,
      rotation: 0,
      fontSize: 24,
      fontFamily: DEFAULT_FONT_FAMILY,
    };
    this.textLayers.update((layers) => [...layers, layer]);
    this.selectedLayerId.set(layer.id);
  }

  selectLayer(id: string): void {

    if (id === this.selectedLayerId()) {
      this.selectedLayerId.set(null);
      return;
    }
    this.selectedLayerId.set(id);
  }

  deleteSelectedLayer(selectedId?: string): void {
    const id = selectedId ?? this.selectedLayerId();
    if (!id) {
      return;
    }
    this.textLayers.update((layers) => layers.filter((l) => l.id !== id));
    this.selectedLayerId.set(null);
  }

  updateSelectedLayer(partial: Partial<Omit<TextLayer, 'id'>>): void {
    const id = this.selectedLayerId();
    if (!id) {
      return;
    }
    this.textLayers.update((layers) =>
      layers.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    );
  }

  onLayerPointerDown(event: PointerEvent, layerId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.selectedLayerId.set(layerId);
    const layer = this.textLayers().find((l) => l.id === layerId);
    if (!layer || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.dragState = {
      layerId,
      offsetX: event.clientX - rect.left - layer.x,
      offsetY: event.clientY - rect.top - layer.y,
    };
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.dragState || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(rect.width, event.clientX - rect.left - this.dragState.offsetX),
    );
    const y = Math.max(
      0,
      Math.min(rect.height, event.clientY - rect.top - this.dragState.offsetY),
    );
    const layerId = this.dragState.layerId;
    this.textLayers.update((layers) =>
      layers.map((l) => (l.id === layerId ? { ...l, x, y } : l)),
    );
  }

  private endDrag(): void {
    this.dragState = null;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  layerTransform(layer: TextLayer): string {
    return `translate(-50%, -50%) rotate(${layer.rotation}deg)`;
  }

  thumbnailSrc(template: (typeof PRODUCT_TEMPLATES)[number]): string {
    return template.thumbnailSrc ?? template.imageSrc;
  }

  async downloadImage(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.isDownloading()) {
      return;
    }

    const img = this.canvasImage?.nativeElement;
    const container = this.canvasContainer?.nativeElement;
    if (!img?.complete || !container) {
      return;
    }

    this.isDownloading.set(true);
    try {
      const families = [...new Set(this.textLayers().map((l) => l.fontFamily))];
      await Promise.all([
        ...families.map((family) => document.fonts.load(`24px "${family}"`)),
        document.fonts.ready,
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.drawImage(img, 0, 0);

      const scaleX = img.naturalWidth / container.clientWidth;
      const scaleY = img.naturalHeight / container.clientHeight;

      for (const layer of this.textLayers()) {
        const x = layer.x * scaleX;
        const y = layer.y * scaleY;
        const fontSize = layer.fontSize * scaleX;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.fillStyle = '#000000';
        ctx.font = `${fontSize}px "${layer.fontFamily}"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.content, 0, 0);
        ctx.restore();
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png'),
      );
      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.selectedTemplate().id}-custom.png`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      this.isDownloading.set(false);
    }
  }
}
