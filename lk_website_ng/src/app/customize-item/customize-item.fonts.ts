export interface FontOption {
  id: string;
  label: string;
  family: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'hello-valentica', label: 'Hello Valentica', family: 'Hello Valentica' },
  { id: 'dejavu-serif', label: 'DejaVu Serif', family: 'DejaVu Serif' },
  { id: 'comic-sans', label: 'Comic Sans', family: 'Comic Sans MS' },
  { id: 'bakerie-rough', label: 'Bakerie Rough', family: 'Bakerie Rough' },
  { id: 'bellaboo', label: 'Bellaboo', family: 'Bellaboo' },
  { id: 'bellota', label: 'Bellota', family: 'Bellota' },
  { id: 'brusher', label: 'Brusher', family: 'Brusher' },
  { id: 'dancing-script', label: 'Dancing Script', family: 'Dancing Script' },
  { id: 'yeseva-one', label: 'Yeseva One', family: 'Yeseva One' },
  { id: 'gladiola', label: 'Gladiola', family: 'Gladiola' },
  { id: 'espoir-serif', label: 'Espoir Serif', family: 'Espoir Serif' },
  { id: 'malibu', label: 'Malibu', family: 'Malibu' },
  { id: 'impact', label: 'Impact', family: 'Impact' },
  { id: 'shrikhand', label: 'Shrikhand', family: 'Shrikhand' },
  { id: 'bebas-neue', label: 'Bebas Neue', family: 'Bebas Neue' },
  { id: 'times-new-roman', label: 'Times New Roman', family: 'Times New Roman' },
  { id: 'ahkio', label: 'Ahkio', family: 'Ahkio' },
  { id: 'hangyaboly', label: 'Hangyaboly', family: 'Hangyaboly' },
  { id: 'brittany-signature', label: 'Brittany Signature', family: 'Brittany Signature' },
  { id: 'oleo-script', label: 'Oleo Script', family: 'Oleo Script' },
];

export const DEFAULT_FONT_FAMILY = FONT_OPTIONS[0].family;

/** Self-hosted font files expected in public/fonts/ */
export const SELF_HOSTED_FONT_FILES = [
  'HelloValentica.ttf',
  'DejaVuSerif.ttf',
  'bakeriemedium.ttf',
  'bellaboo.ttf',
  'brusher.ttf',
  'gladiola.ttf',
  'espoirserif.ttf',
  'Malibu.ttf',
  'Ahkio.ttf',
  'Hangyaboly.ttf',
  'BrittanySignature.ttf',
] as const;

/** Loaded via Google Fonts (see index.html) */
export const GOOGLE_FONT_FAMILIES = [
  'Bellota',
  'Dancing Script',
  'Yeseva One',
  'Shrikhand',
  'Bebas Neue',
  'Oleo Script',
] as const;

/** Uses OS-installed fonts (no file needed on Windows) */
export const SYSTEM_FONT_FAMILIES = ['Comic Sans MS', 'Impact', 'Times New Roman'] as const;
