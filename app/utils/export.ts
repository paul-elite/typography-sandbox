import { TypographyState, ExportFormat, LayerTypography, TextLayer } from '../types/typography';

export function exportTypography(layerTypography: LayerTypography, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return exportAsCSS(layerTypography);
    case 'tailwind':
      return exportAsTailwind(layerTypography);
    case 'json':
      return exportAsJSON(layerTypography);
    default:
      return '';
  }
}

function formatLayerCSS(typography: TypographyState, className: string): string {
  const { fontFamily, fontSize, fontWeight, letterSpacing, wordSpacing, lineHeight, paragraphWidth, textAlign, textColor } = typography;

  return `.${className} {
  font-family: '${fontFamily}', sans-serif;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  letter-spacing: ${letterSpacing}em;
  word-spacing: ${wordSpacing}em;
  line-height: ${lineHeight};
  max-width: ${paragraphWidth}ch;
  text-align: ${textAlign};
  color: ${textColor};
}`;
}

function exportAsCSS(layerTypography: LayerTypography): string {
  const layers: TextLayer[] = ['heading', 'paragraph', 'caption'];

  const layerClasses = layers.map(layer =>
    formatLayerCSS(layerTypography[layer], `typography-${layer}`)
  ).join('\n\n');

  // Generate CSS custom properties for each layer
  const customProperties = layers.map(layer => {
    const t = layerTypography[layer];
    return `  /* ${layer.charAt(0).toUpperCase() + layer.slice(1)} */
  --${layer}-font-family: '${t.fontFamily}', sans-serif;
  --${layer}-font-size: ${t.fontSize}px;
  --${layer}-font-weight: ${t.fontWeight};
  --${layer}-letter-spacing: ${t.letterSpacing}em;
  --${layer}-word-spacing: ${t.wordSpacing}em;
  --${layer}-line-height: ${t.lineHeight};
  --${layer}-paragraph-width: ${t.paragraphWidth}ch;
  --${layer}-text-align: ${t.textAlign};
  --${layer}-text-color: ${t.textColor};`;
  }).join('\n\n');

  return `${layerClasses}

/* CSS Custom Properties */
:root {
${customProperties}
}`;
}

function exportAsTailwind(layerTypography: LayerTypography): string {
  const layers: TextLayer[] = ['heading', 'paragraph', 'caption'];

  const fontFamilies: Record<string, string[]> = {};
  const fontSizes: Record<string, (string | Record<string, string>)[]> = {};
  const letterSpacings: Record<string, string> = {};
  const lineHeights: Record<string, string> = {};
  const maxWidths: Record<string, string> = {};
  const textColors: Record<string, string> = {};

  layers.forEach(layer => {
    const t = layerTypography[layer];
    const trackingValue = t.letterSpacing === 0 ? 'normal' : `${t.letterSpacing}em`;

    fontFamilies[layer] = [`'${t.fontFamily}'`, 'sans-serif'];
    fontSizes[layer] = [`${t.fontSize}px`, {
      lineHeight: `${t.lineHeight}`,
      letterSpacing: trackingValue,
      fontWeight: `${t.fontWeight}`,
    }];
    letterSpacings[layer] = trackingValue;
    lineHeights[layer] = `${t.lineHeight}`;
    maxWidths[`prose-${layer}`] = `${t.paragraphWidth}ch`;
    textColors[layer] = t.textColor;
  });

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: ${JSON.stringify(fontFamilies, null, 8).replace(/\n/g, '\n      ')},
      fontSize: ${JSON.stringify(fontSizes, null, 8).replace(/\n/g, '\n      ')},
      letterSpacing: ${JSON.stringify(letterSpacings, null, 8).replace(/\n/g, '\n      ')},
      lineHeight: ${JSON.stringify(lineHeights, null, 8).replace(/\n/g, '\n      ')},
      maxWidth: ${JSON.stringify(maxWidths, null, 8).replace(/\n/g, '\n      ')},
      colors: {
        typography: ${JSON.stringify(textColors, null, 10).replace(/\n/g, '\n        ')},
      },
    },
  },
}

/* Usage examples:

Heading:
<h1 className="font-heading text-heading tracking-heading leading-heading max-w-prose-heading text-typography-heading">
  Your heading here
</h1>

Paragraph:
<p className="font-paragraph text-paragraph tracking-paragraph leading-paragraph max-w-prose-paragraph text-typography-paragraph">
  Your text here
</p>

Caption:
<span className="font-caption text-caption tracking-caption leading-caption max-w-prose-caption text-typography-caption">
  Your caption here
</span>
*/`;
}

function exportAsJSON(layerTypography: LayerTypography): string {
  const layers: TextLayer[] = ['heading', 'paragraph', 'caption'];

  const typography: Record<string, Record<string, { value: string | number; type: string }>> = {};

  layers.forEach(layer => {
    const t = layerTypography[layer];
    typography[layer] = {
      fontFamily: {
        value: t.fontFamily,
        type: 'fontFamily',
      },
      fontSize: {
        value: `${t.fontSize}px`,
        type: 'fontSize',
      },
      fontWeight: {
        value: t.fontWeight,
        type: 'fontWeight',
      },
      letterSpacing: {
        value: `${t.letterSpacing}em`,
        type: 'letterSpacing',
      },
      wordSpacing: {
        value: `${t.wordSpacing}em`,
        type: 'dimension',
      },
      lineHeight: {
        value: t.lineHeight,
        type: 'lineHeight',
      },
      paragraphWidth: {
        value: `${t.paragraphWidth}ch`,
        type: 'dimension',
      },
      textAlign: {
        value: t.textAlign,
        type: 'textAlign',
      },
      textColor: {
        value: t.textColor,
        type: 'color',
      },
    };
  });

  const tokens = {
    typography,
    meta: {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      generator: 'Typography Sandbox',
    },
  };

  return JSON.stringify(tokens, null, 2);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
