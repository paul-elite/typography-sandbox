# Typography Sandbox

A real-time typography experimentation tool built with Next.js, Tailwind CSS, and TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Typography Preview Canvas** - Word, Sentence, Paragraph, and Custom text modes
- **Typography Controls** - Font family, size, weight, tracking, word spacing, line height, paragraph width, alignment
- **Typography Metrics** - Real-time metrics with reading comfort score
- **Typography Guides** - Baseline grid, line box, x-height overlays
- **Responsive Preview** - Mobile, Tablet, Desktop viewport presets
- **Export** - CSS, Tailwind config, and JSON design tokens

## Project Structure

```
app/
├── components/
│   ├── ExportPanel/
│   ├── FontSelector/
│   ├── PreviewModes/
│   ├── TypographyCanvas/
│   ├── TypographyControls/
│   ├── TypographyMetrics/
│   └── ui/Slider.tsx
├── hooks/
│   ├── useFontLoader.ts
│   └── useTypography.ts
├── types/typography.ts
├── utils/export.ts
└── page.tsx
```

## Build

```bash
npm run build
npm start
```
