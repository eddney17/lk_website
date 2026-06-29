import {
  Component,
  computed,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PRODUCT_TEMPLATES,
  TextLayer,
} from './customize-item.types';
import { DEFAULT_FONT_FAMILY, FONT_OPTIONS } from './customize-item.fonts';

interface DragState {
  mode: 'drag';
  layerId: string;
  offsetX: number;
  offsetY: number;
  startClientX: number;
  startClientY: number;
  hasMoved: boolean;
  wasAlreadySelected: boolean;
}

interface ResizeState {
  mode: 'resize';
  layerId: string;
  startFontSize: number;
  startDistance: number;
  centerX: number;
  centerY: number;
}

interface RotateState {
  mode: 'rotate';
  layerId: string;
  startRotation: number;
  startAngle: number;
  centerX: number;
  centerY: number;
}

type InteractionState = DragState | ResizeState | RotateState;

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 120;
const DEFAULT_TEXT_CONTENT = 'Your Text';
const TAP_MOVE_THRESHOLD = 8;

@Component({
  selector: 'app-customize-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customize-item.html',
  styleUrls: ['./customize-item.scss', './customize-item.fonts.scss'],
})
export class CustomizeItem {
  readonly productTemplates = PRODUCT_TEMPLATES;
  readonly fontOptions = FONT_OPTIONS;

  readonly selectedProductId = signal(PRODUCT_TEMPLATES[0].id);
  readonly textLayers = signal<TextLayer[]>([]);
  readonly selectedLayerId = signal<string | null>(null);
  readonly canvasSize = signal({ width: 0, height: 0 });
  readonly isDownloading = signal(false);
  readonly productDropdownOpen = signal(false);
  readonly editingLayerId = signal<string | null>(null);

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

  private interactionState: InteractionState | null = null;
  private editStartContent = '';
  private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private readonly onPointerUp = () => this.endInteraction();

  selectProduct(id: string): void {
    this.productDropdownOpen.set(false);
    if (id === this.selectedProductId()) {
      return;
    }
    this.editingLayerId.set(null);
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

  blurClickedButton(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    queueMicrotask(() => target.blur());
  }

  onCanvasImageLoad(): void {
    this.updateCanvasSize();
    if (this.textLayers().length === 0) {
      this.setDefaultTextLayer();
    }
  }

  onCanvasPointerDown(): void {
    if (this.editingLayerId()) {
      this.stopEditingLayer();
    }
    this.selectedLayerId.set(null);
  }

  updateCanvasSize(): void {
    if (!this.canvasContainer?.nativeElement) {
      return;
    }
    const el = this.canvasContainer.nativeElement;
    this.canvasSize.set({ width: el.clientWidth, height: el.clientHeight });
  }

  private createTextLayer(content = DEFAULT_TEXT_CONTENT): TextLayer {
    const size = this.canvasSize();
    return {
      id: crypto.randomUUID(),
      content,
      x: size.width / 2 || 200,
      y: size.height / 2 || 150,
      rotation: 0,
      fontSize: 24,
      fontFamily: DEFAULT_FONT_FAMILY,
    };
  }

  private setDefaultTextLayer(): void {
    const layer = this.createTextLayer();
    this.textLayers.set([layer]);
    this.selectedLayerId.set(layer.id);
  }

  addText(): void {
    const layer = this.createTextLayer();
    this.textLayers.update((layers) => [...layers, layer]);
    this.selectedLayerId.set(layer.id);
  }

  selectLayer(id: string): void {
    if (this.editingLayerId()) {
      this.stopEditingLayer();
    }

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
    if (this.editingLayerId() === id) {
      this.editingLayerId.set(null);
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
    if (this.editingLayerId() === layerId) {
      return;
    }
    event.stopPropagation();
    const wasAlreadySelected = this.selectedLayerId() === layerId;
    this.selectedLayerId.set(layerId);
    const layer = this.textLayers().find((l) => l.id === layerId);
    if (!layer || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.interactionState = {
      mode: 'drag',
      layerId,
      offsetX: event.clientX - rect.left - layer.x,
      offsetY: event.clientY - rect.top - layer.y,
      startClientX: event.clientX,
      startClientY: event.clientY,
      hasMoved: false,
      wasAlreadySelected,
    };
    this.attachPointerListeners();
  }

  onLayerDoubleClick(event: MouseEvent, layerId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.endInteraction();
    this.startEditingLayer(layerId);
  }

  startEditingLayer(layerId: string, focusAfterRender = false): void {
    const layer = this.textLayers().find((l) => l.id === layerId);
    if (!layer) {
      return;
    }
    this.editStartContent = layer.content;
    this.selectedLayerId.set(layerId);
    this.editingLayerId.set(layerId);

    const focusInput = (): void => {
      const input = document.querySelector<HTMLInputElement>(
        `[data-layer-input="${layerId}"]`,
      );
      input?.focus();
      input?.select();
    };

    if (focusAfterRender) {
      requestAnimationFrame(() => {
        requestAnimationFrame(focusInput);
      });
      return;
    }

    queueMicrotask(focusInput);
  }

  stopEditingLayer(): void {
    this.editingLayerId.set(null);
  }

  cancelEditingLayer(layerId: string): void {
    this.updateLayer(layerId, { content: this.editStartContent });
    this.editingLayerId.set(null);
  }

  onLayerInputKeydown(event: KeyboardEvent, layerId: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      (event.target as HTMLInputElement).blur();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditingLayer(layerId);
    }
  }

  onResizePointerDown(event: PointerEvent, layerId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedLayerId.set(layerId);
    const layer = this.textLayers().find((l) => l.id === layerId);
    if (!layer || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const dx = pointerX - layer.x;
    const dy = pointerY - layer.y;
    this.interactionState = {
      mode: 'resize',
      layerId,
      startFontSize: layer.fontSize,
      startDistance: Math.hypot(dx, dy) || 1,
      centerX: layer.x,
      centerY: layer.y,
    };
    this.attachPointerListeners();
  }

  onRotatePointerDown(event: PointerEvent, layerId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedLayerId.set(layerId);
    const layer = this.textLayers().find((l) => l.id === layerId);
    if (!layer || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    this.interactionState = {
      mode: 'rotate',
      layerId,
      startRotation: layer.rotation,
      startAngle: Math.atan2(pointerY - layer.y, pointerX - layer.x) * (180 / Math.PI),
      centerX: layer.x,
      centerY: layer.y,
    };
    this.attachPointerListeners();
  }

  private attachPointerListeners(): void {
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.interactionState || !this.canvasContainer?.nativeElement) {
      return;
    }
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const state = this.interactionState;

    if (state.mode === 'drag') {
      if (!state.hasMoved) {
        const movedDistance = Math.hypot(
          event.clientX - state.startClientX,
          event.clientY - state.startClientY,
        );
        if (movedDistance < TAP_MOVE_THRESHOLD) {
          return;
        }
        state.hasMoved = true;
      }

      const x = Math.max(0, Math.min(rect.width, pointerX - state.offsetX));
      const y = Math.max(0, Math.min(rect.height, pointerY - state.offsetY));
      this.updateLayer(state.layerId, { x, y });
      return;
    }

    if (state.mode === 'resize') {
      const dx = pointerX - state.centerX;
      const dy = pointerY - state.centerY;
      const distance = Math.hypot(dx, dy);
      const scale = distance / state.startDistance;
      const fontSize = Math.round(
        Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, state.startFontSize * scale)),
      );
      this.updateLayer(state.layerId, { fontSize });
      return;
    }

    const currentAngle =
      Math.atan2(pointerY - state.centerY, pointerX - state.centerX) * (180 / Math.PI);
    const rotation = Math.round(state.startRotation + (currentAngle - state.startAngle));
    this.updateLayer(state.layerId, { rotation });
  }

  updateLayer(layerId: string, partial: Partial<Omit<TextLayer, 'id'>>): void {
    this.textLayers.update((layers) =>
      layers.map((l) => (l.id === layerId ? { ...l, ...partial } : l)),
    );
  }

  private endInteraction(): void {
    const state = this.interactionState;

    if (
      state?.mode === 'drag' &&
      !state.hasMoved &&
      state.wasAlreadySelected &&
      this.editingLayerId() !== state.layerId
    ) {
      this.startEditingLayer(state.layerId, true);
    }

    this.interactionState = null;
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
    if (this.isDownloading()) {
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
