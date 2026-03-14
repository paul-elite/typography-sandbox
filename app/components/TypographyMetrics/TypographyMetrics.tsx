'use client';

import { useMemo } from 'react';
import { TypographyState } from '../../types/typography';

interface TypographyMetricsProps {
  typography: TypographyState;
  readingComfort: number;
  comfortLevel: { label: string; color: string };
}

const COMFORT_COLORS = [
  { hex: '#F11617', label: 'Very Poor' },
  { hex: '#FE5900', label: 'Poor' },
  { hex: '#FFCE04', label: 'Fair' },
  { hex: '#35BCFA', label: 'Good' },
  { hex: '#0048FD', label: 'Very Good' },
  { hex: '#01A451', label: 'Excellent' },
];

export function TypographyMetrics({
  typography,
  readingComfort,
}: TypographyMetricsProps) {
  const metrics = [
    { label: 'Font', value: typography.fontFamily },
    { label: 'Size', value: `${typography.fontSize}px` },
    { label: 'Weight', value: typography.fontWeight.toString() },
    { label: 'Tracking', value: `${typography.letterSpacing.toFixed(2)}em` },
    { label: 'Word Spacing', value: `${typography.wordSpacing.toFixed(2)}em` },
    { label: 'Line Height', value: typography.lineHeight.toFixed(2) },
    { label: 'Line Length', value: `${typography.paragraphWidth}ch` },
    { label: 'Alignment', value: typography.textAlign.charAt(0).toUpperCase() + typography.textAlign.slice(1) },
  ];

  // Determine which segment is active (0-5)
  const activeSegment = useMemo(() => {
    if (readingComfort <= 16.67) return 0;
    if (readingComfort <= 33.33) return 1;
    if (readingComfort <= 50) return 2;
    if (readingComfort <= 66.67) return 3;
    if (readingComfort <= 83.33) return 4;
    return 5;
  }, [readingComfort]);

  const activeColor = COMFORT_COLORS[activeSegment];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
        Typography Metrics
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between items-baseline">
            <span className="text-xs text-zinc-500">{metric.label}</span>
            <span className="text-sm text-zinc-700 font-mono">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">Reading Comfort</span>
          <span
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: activeColor.hex }}
          >
            {activeColor.label}
          </span>
        </div>

        {/* Segmented color bar */}
        <div className="relative">
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {COMFORT_COLORS.map((color, index) => (
              <div
                key={color.hex}
                className="flex-1 transition-all duration-300 relative"
                style={{
                  backgroundColor: color.hex,
                  opacity: index <= activeSegment ? 1 : 0.25,
                }}
              >
                {/* Pulse animation on active segment */}
                {index === activeSegment && (
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                      backgroundColor: color.hex,
                      opacity: 0.5,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Indicator thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 transition-all duration-300 z-10"
            style={{
              left: `calc(${readingComfort}% - 8px)`,
              borderColor: activeColor.hex,
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-zinc-400">Poor</span>
          <span className="text-[10px] text-zinc-500 font-mono">{readingComfort}%</span>
          <span className="text-[10px] text-zinc-400">Excellent</span>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-200 space-y-2">
        <h3 className="text-xs font-medium text-zinc-600">Quick Tips</h3>
        <ul className="text-xs text-zinc-500 space-y-1">
          {typography.fontSize < 16 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Consider increasing font size for better readability</span>
            </li>
          )}
          {typography.lineHeight < 1.4 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Line height below 1.4 may reduce readability</span>
            </li>
          )}
          {typography.paragraphWidth > 80 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Line length over 80ch can strain the eye</span>
            </li>
          )}
          {typography.paragraphWidth < 45 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Very short lines can disrupt reading rhythm</span>
            </li>
          )}
          {Math.abs(typography.letterSpacing) > 0.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Extreme letter spacing affects legibility</span>
            </li>
          )}
          {readingComfort >= 80 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#01A451' }}>✓</span>
              <span>Typography settings are well-optimized</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
