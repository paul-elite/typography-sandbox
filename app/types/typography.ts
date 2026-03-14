export interface TypographyState {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  paragraphWidth: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

export interface FontOption {
  family: string;
  weights: number[];
  category: string;
}

// Text layer types
export type TextLayer = 'heading' | 'paragraph' | 'caption';

// Each layer has its own typography settings
export interface LayerTypography {
  heading: TypographyState;
  paragraph: TypographyState;
  caption: TypographyState;
}

// Layout settings for the container
export interface LayoutSettings {
  headingParagraphGap: number;  // Gap between heading and paragraph (px)
  paragraphCaptionGap: number;  // Gap between paragraph and caption (px)
  padding: number;              // Container padding (px)
  alignment: 'start' | 'center' | 'stretch';  // Cross-axis alignment
}

// Default text content for each layer
export const DEFAULT_LAYER_CONTENT = {
  heading: 'The Art of Typography',
  paragraph: 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. Good typography establishes a strong visual hierarchy and ensures an excellent user experience.',
  caption: 'Photo credit: Design Tales, 2026',
};

// Layer content type
export interface LayerContent {
  heading: string;
  paragraph: string;
  caption: string;
}

export type PreviewMode = 'word' | 'sentence' | 'paragraph' | 'custom';

export type ViewportPreset = 'mobile' | 'tablet' | 'desktop';

export type ExportFormat = 'css' | 'tailwind' | 'json';

export interface TypographyGuides {
  baselineGrid: boolean;
  lineBox: boolean;
  xHeight: boolean;
}

export interface ViewportDimensions {
  width: number;
  label: string;
}

export const VIEWPORT_PRESETS: Record<ViewportPreset, ViewportDimensions> = {
  mobile: { width: 375, label: 'Mobile (375px)' },
  tablet: { width: 768, label: 'Tablet (768px)' },
  desktop: { width: 1200, label: 'Desktop (1200px)' },
};

export const DEFAULT_TYPOGRAPHY: TypographyState = {
  fontFamily: 'Inter',
  fontSize: 18,
  fontWeight: 400,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.5,
  paragraphWidth: 65,
  textAlign: 'left',
};

// Default typography per layer
export const DEFAULT_HEADING_TYPOGRAPHY: TypographyState = {
  fontFamily: 'Inter',
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: -0.02,
  wordSpacing: 0,
  lineHeight: 1.2,
  paragraphWidth: 65,
  textAlign: 'left',
};

export const DEFAULT_PARAGRAPH_TYPOGRAPHY: TypographyState = {
  fontFamily: 'Inter',
  fontSize: 18,
  fontWeight: 400,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.6,
  paragraphWidth: 65,
  textAlign: 'left',
};

export const DEFAULT_CAPTION_TYPOGRAPHY: TypographyState = {
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 400,
  letterSpacing: 0.01,
  wordSpacing: 0,
  lineHeight: 1.4,
  paragraphWidth: 65,
  textAlign: 'left',
};

export const DEFAULT_LAYOUT: LayoutSettings = {
  headingParagraphGap: 16,
  paragraphCaptionGap: 24,
  padding: 32,
  alignment: 'start',
};

export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const TEXT_ALIGNMENTS: Array<{ value: TypographyState['textAlign']; label: string; icon: string }> = [
  { value: 'left', label: 'Left', icon: '⫿' },
  { value: 'center', label: 'Center', icon: '☰' },
  { value: 'right', label: 'Right', icon: '⫾' },
  { value: 'justify', label: 'Justify', icon: '☷' },
];

export const PREVIEW_TEXTS: Record<Exclude<PreviewMode, 'custom'>, string> = {
  word: 'Typography',
  sentence: 'The quick brown fox jumps over the lazy dog.',
  paragraph: `Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, as well as adjusting the space between pairs of letters.

Good typography establishes a strong visual hierarchy, provides a graphic balance to the website, and sets the product's overall tone. Typography should guide and inform your users, optimize readability and accessibility, and ensure an excellent user experience.`,
};

export const POPULAR_FONTS: FontOption[] = [
  { family: 'Inter', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], category: 'sans-serif' },
  { family: 'Roboto', weights: [100, 300, 400, 500, 700, 900], category: 'sans-serif' },
  { family: 'Open Sans', weights: [300, 400, 500, 600, 700, 800], category: 'sans-serif' },
  { family: 'Lato', weights: [100, 300, 400, 700, 900], category: 'sans-serif' },
  { family: 'Montserrat', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], category: 'sans-serif' },
  { family: 'Poppins', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], category: 'sans-serif' },
  { family: 'Playfair Display', weights: [400, 500, 600, 700, 800, 900], category: 'serif' },
  { family: 'Merriweather', weights: [300, 400, 700, 900], category: 'serif' },
  { family: 'Lora', weights: [400, 500, 600, 700], category: 'serif' },
  { family: 'Source Serif Pro', weights: [200, 300, 400, 600, 700, 900], category: 'serif' },
  { family: 'IBM Plex Mono', weights: [100, 200, 300, 400, 500, 600, 700], category: 'monospace' },
  { family: 'Fira Code', weights: [300, 400, 500, 600, 700], category: 'monospace' },
  { family: 'JetBrains Mono', weights: [100, 200, 300, 400, 500, 600, 700, 800], category: 'monospace' },
  { family: 'Space Grotesk', weights: [300, 400, 500, 600, 700], category: 'sans-serif' },
  { family: 'DM Sans', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], category: 'sans-serif' },
];
