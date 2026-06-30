export interface ProductTextPlacement {
  /** Horizontal position as a percentage of canvas width (0–100). */
  xPercent: number;
  /** Vertical position as a percentage of canvas height (0–100). */
  yPercent: number;
  rotation?: number;
  fontSize?: number;
  /** Optional override when viewport is mobile (see `isMobileScreen` in types). */
  fontSizeMobile?: number;
}

export const DEFAULT_TEXT_PLACEMENT: ProductTextPlacement = {
  xPercent: 50,
  yPercent: 50,
  rotation: 0,
  fontSize: 36,
};

/** Default text placement per product — tune xPercent/yPercent to match each image. */
export const PRODUCT_TEXT_PLACEMENTS: Record<string, ProductTextPlacement> = {
  'wooden-keychain': {
    xPercent: 67,
    yPercent: 48,
    rotation: -5,
    fontSize: 42,
    fontSizeMobile: 28,
  },
  'bamboo-pen': {
    xPercent: 35,
    yPercent: 47,
    rotation: 0,
    fontSize: 25,
    fontSizeMobile: 16,
  },
  cheeseboard: {
    xPercent: 25,
    yPercent: 65,
    rotation: 0,
    fontSize: 34,
    fontSizeMobile: 22,
  },
  'premium-wooden-keychain': {
    xPercent: 67,
    yPercent: 47,
    rotation: -6,
    fontSize: 42,
    fontSizeMobile: 28,
  },
  'wooden-brush': {
    xPercent: 55,
    yPercent: 42,
    rotation: 0,
    fontSize: 30,
    fontSizeMobile: 20,
  },
};

export function getProductTextPlacement(productId: string): ProductTextPlacement {
  return PRODUCT_TEXT_PLACEMENTS[productId] ?? DEFAULT_TEXT_PLACEMENT;
}
