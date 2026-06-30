export interface ProductTemplate {
  id: string;
  label: string;
  imageSrc: string;
  thumbnailSrc?: string;
}

export interface TextLayer {
  id: string;
  content: string;
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
  fontFamily: string;
}

/** Matches `$mobile-breakpoint` in customize-item.scss */
export const CUSTOMIZE_MOBILE_BREAKPOINT_PX = 600;

/** Desktop canvas reference width used to scale font size on smaller screens. */
export const CUSTOMIZE_REFERENCE_CANVAS_WIDTH_PX = 800;

export interface FontSizePlacement {
  fontSize?: number;
  fontSizeMobile?: number;
}

export function isMobileScreen(
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : CUSTOMIZE_MOBILE_BREAKPOINT_PX + 1,
): boolean {
  return viewportWidth <= CUSTOMIZE_MOBILE_BREAKPOINT_PX;
}

/**
 * Resolves font size for the current viewport.
 * Uses `fontSizeMobile` when set; otherwise scales `fontSize` on mobile using canvas width.
 */
export function resolvePlacementFontSize(
  placement: FontSizePlacement,
  canvasWidth?: number,
): number {
  const baseFontSize = placement.fontSize ?? 36;

  if (!isMobileScreen()) {
    return baseFontSize;
  }

  if (placement.fontSizeMobile !== undefined) {
    return placement.fontSizeMobile;
  }

  const width =
    canvasWidth ??
    (typeof window !== 'undefined' ? window.innerWidth : CUSTOMIZE_MOBILE_BREAKPOINT_PX);

  const scale = Math.min(1, width / CUSTOMIZE_REFERENCE_CANVAS_WIDTH_PX);
  return Math.max(12, Math.round(baseFontSize * scale));
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 'wooden-keychain',
    label: 'Wooden Keychain',
    imageSrc: '/lk_edititem_img_woodenkeychain.png.png',
  },
  {
    id: 'bamboo-pen',
    label: 'Bamboo Pen',
    imageSrc: '/lk_edititem_img_bamboopen.png.png',
  },
  {
    id: 'cheeseboard',
    label: 'Bamboo Cheese Board',
    imageSrc: '/lk_edititem_img_cheeseboard.png.png',
  },
  {
    id: 'premium-wooden-keychain',
    label: 'Premium Wooden Keychain',
    imageSrc: '/lk_edititem_img_premiumwoodenkeychain.png.png',
  },
  {
    id: 'wooden-brush',
    label: 'Wooden Brush',
    imageSrc: '/lk_edititem_img_woodenbrush.png.png',
  },
];
