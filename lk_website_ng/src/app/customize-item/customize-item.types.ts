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
    id: 'keychain',
    label: 'Wooden Keychain',
    imageSrc: '/lk_edititem_img_wkeychain.png',
  },
  {
    id: 'wooden-brush',
    label: 'Wooden Brush',
    imageSrc: '/lk_edititem_img_woodenbrush.png.png',
  },
];
