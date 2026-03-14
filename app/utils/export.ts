import { TypographyState, ExportFormat } from '../types/typography';

export function exportTypography(typography: TypographyState, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return exportAsCSS(typography);
    case 'tailwind':
      return exportAsTailwind(typography);
    case 'json':
      return exportAsJSON(typography);
    default:
      return '';
  }
}

function exportAsCSS(typography: TypographyState): string {
  const { fontFamily, fontSize, fontWeight, letterSpacing, wordSpacing, lineHeight, paragraphWidth, textAlign } = typography;

  return `.typography {
  font-family: '${fontFamily}', sans-serif;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  letter-spacing: ${letterSpacing}em;
  word-spacing: ${wordSpacing}em;
  line-height: ${lineHeight};
  max-width: ${paragraphWidth}ch;
  text-align: ${textAlign};
}

/* CSS Custom Properties */
:root {
  --font-family: '${fontFamily}', sans-serif;
  --font-size: ${fontSize}px;
  --font-weight: ${fontWeight};
  --letter-spacing: ${letterSpacing}em;
  --word-spacing: ${wordSpacing}em;
  --line-height: ${lineHeight};
  --paragraph-width: ${paragraphWidth}ch;
  --text-align: ${textAlign};
}`;
}

function exportAsTailwind(typography: TypographyState): string {
  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, paragraphWidth } = typography;

  // Convert values to Tailwind-compatible format
  const trackingValue = letterSpacing === 0 ? 'normal' : `${letterSpacing}em`;
  const leadingValue = lineHeight;

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'custom': ['${fontFamily}', 'sans-serif'],
      },
      fontSize: {
        'custom': ['${fontSize}px', {
          lineHeight: '${leadingValue}',
          letterSpacing: '${trackingValue}',
          fontWeight: '${fontWeight}',
        }],
      },
      letterSpacing: {
        'custom': '${trackingValue}',
      },
      lineHeight: {
        'custom': '${leadingValue}',
      },
      maxWidth: {
        'prose-custom': '${paragraphWidth}ch',
      },
    },
  },
}

/* Usage example:
<p className="font-custom text-custom tracking-custom leading-custom max-w-prose-custom">
  Your text here
</p>
*/`;
}

function exportAsJSON(typography: TypographyState): string {
  const { fontFamily, fontSize, fontWeight, letterSpacing, wordSpacing, lineHeight, paragraphWidth, textAlign } = typography;

  const tokens = {
    typography: {
      fontFamily: {
        value: fontFamily,
        type: 'fontFamily',
      },
      fontSize: {
        value: `${fontSize}px`,
        type: 'fontSize',
      },
      fontWeight: {
        value: fontWeight,
        type: 'fontWeight',
      },
      letterSpacing: {
        value: `${letterSpacing}em`,
        type: 'letterSpacing',
      },
      wordSpacing: {
        value: `${wordSpacing}em`,
        type: 'dimension',
      },
      lineHeight: {
        value: lineHeight,
        type: 'lineHeight',
      },
      paragraphWidth: {
        value: `${paragraphWidth}ch`,
        type: 'dimension',
      },
      textAlign: {
        value: textAlign,
        type: 'textAlign',
      },
    },
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
