'use client';

import { useMemo } from 'react';
import { TypographyState, ViewportPreset, VIEWPORT_PRESETS, TypographyGuides } from '../../types/typography';

interface TypographyCanvasProps {
  typography: TypographyState;
  previewText: string;
  viewport: ViewportPreset;
  guides: TypographyGuides;
  isFontLoaded: boolean;
}

export function TypographyCanvas({
  typography,
  previewText,
  viewport,
  guides,
  isFontLoaded,
}: TypographyCanvasProps) {
  const viewportWidth = VIEWPORT_PRESETS[viewport].width;

  const textStyle = useMemo(() => ({
    fontFamily: isFontLoaded ? `'${typography.fontFamily}', sans-serif` : 'system-ui, sans-serif',
    fontSize: `${typography.fontSize}px`,
    fontWeight: typography.fontWeight,
    letterSpacing: `${typography.letterSpacing}em`,
    wordSpacing: `${typography.wordSpacing}em`,
    lineHeight: typography.lineHeight,
    maxWidth: `${typography.paragraphWidth}ch`,
    textAlign: typography.textAlign as React.CSSProperties['textAlign'],
  }), [typography, isFontLoaded]);

  const combinedGuideStyle = useMemo(() => {
    const styles: React.CSSProperties = {};
    const backgrounds: string[] = [];
    const sizes: string[] = [];

    if (guides.baselineGrid) {
      const lineHeightPx = typography.fontSize * typography.lineHeight;
      backgrounds.push(`linear-gradient(to bottom, transparent ${lineHeightPx - 1}px, rgba(59, 130, 246, 0.4) ${lineHeightPx - 1}px, rgba(59, 130, 246, 0.4) ${lineHeightPx}px)`);
      sizes.push(`100% ${lineHeightPx}px`);
    }

    if (guides.lineBox) {
      const lineHeightPx = typography.fontSize * typography.lineHeight;
      backgrounds.push(`repeating-linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 0px, rgba(168, 85, 247, 0.1) ${lineHeightPx}px, transparent ${lineHeightPx}px, transparent ${lineHeightPx * 2}px)`);
      sizes.push(`100% ${lineHeightPx * 2}px`);
    }

    if (guides.xHeight) {
      const xHeight = typography.fontSize * 0.5;
      const lineHeightPx = typography.fontSize * typography.lineHeight;
      const topOffset = (lineHeightPx - typography.fontSize) / 2 + typography.fontSize * 0.25;
      backgrounds.push(`repeating-linear-gradient(to bottom, transparent 0px, transparent ${topOffset}px, rgba(34, 197, 94, 0.2) ${topOffset}px, rgba(34, 197, 94, 0.2) ${topOffset + xHeight}px, transparent ${topOffset + xHeight}px, transparent ${lineHeightPx}px)`);
      sizes.push(`100% ${lineHeightPx}px`);
    }

    if (backgrounds.length > 0) {
      styles.backgroundImage = backgrounds.join(', ');
      styles.backgroundSize = sizes.join(', ');
    }

    return styles;
  }, [guides, typography.fontSize, typography.lineHeight]);

  const hasGuides = guides.baselineGrid || guides.lineBox || guides.xHeight;

  return (
    <div className="flex-1 flex flex-col">
      {/* Guide Legend */}
      {hasGuides && (
        <div className="flex items-center gap-4 mb-3 px-4">
          {guides.baselineGrid && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded" />
              <span className="text-xs text-zinc-500">Baseline</span>
            </div>
          )}
          {guides.lineBox && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-purple-500/20 rounded-sm" />
              <span className="text-xs text-zinc-500">Line Box</span>
            </div>
          )}
          {guides.xHeight && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 bg-green-500/20 rounded-sm" />
              <span className="text-xs text-zinc-500">X-Height</span>
            </div>
          )}
        </div>
      )}

      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-6 rounded-xl overflow-auto">
        <div
          className="rounded-lg shadow-lg transition-all duration-300 overflow-hidden border border-amber-200"
          style={{ width: `min(100%, ${viewportWidth}px)` }}
        >
          {/* Viewport Indicator */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-amber-300"
            style={{ backgroundColor: '#FBD152' }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-amber-800 font-mono">
              {viewportWidth}px
            </span>
          </div>

          {/* Text Content */}
          <div
            className="p-8 min-h-[200px] relative"
            style={{
              backgroundColor: '#FFF1D4',
              ...(hasGuides ? combinedGuideStyle : {})
            }}
          >
            <div
              className="text-zinc-900 whitespace-pre-wrap break-words mx-auto transition-all duration-150"
              style={textStyle}
            >
              {previewText}
            </div>
          </div>
        </div>
      </div>

      {/* Font Loading Indicator */}
      {!isFontLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full border border-zinc-200">
            <svg
              className="w-4 h-4 animate-spin text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-zinc-700">Loading font...</span>
          </div>
        </div>
      )}
    </div>
  );
}
