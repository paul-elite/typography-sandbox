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
    <div className="bg-white rounded-xl p-5 space-y-4 shadow-[0px_0px_0px_0.5px_rgba(0,0,0,0.1)]">
      <h2 className="text-sm font-semibold text-zinc-800">
        Typography Metrics
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between items-baseline">
            <span className="text-xs text-zinc-400">{metric.label}</span>
            <span className="text-xs text-zinc-700 font-mono font-medium">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400">Reading Comfort</span>
          <span
            className="text-xs font-bold transition-colors duration-300"
            style={{ color: activeColor.hex }}
          >
            {activeColor.label}
          </span>
        </div>

        {/* Segmented squares */}
        <div className="flex gap-0.5">
          {COMFORT_COLORS.map((color, index) => {
            const isFirst = index === 0;
            const isLast = index === COMFORT_COLORS.length - 1;

            return (
              <div
                key={color.hex}
                className="flex-1 h-6 transition-all duration-300"
                style={{
                  backgroundColor: index <= activeSegment ? color.hex : '#e4e4e7',
                  borderRadius: isFirst
                    ? '6px 0 0 6px'
                    : isLast
                      ? '0 6px 6px 0'
                      : '0',
                }}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-zinc-400">Poor</span>
          <span className="text-xs text-zinc-600 font-mono font-bold">{readingComfort}%</span>
          <span className="text-xs text-zinc-400">Excellent</span>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-200 space-y-2">
        <h3 className="text-xs font-medium text-zinc-600">Quick Tips</h3>
        <ul className="text-xs text-zinc-500 space-y-1">
          {/* Font size tips */}
          {typography.fontSize < 14 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#F11617' }}>•</span>
              <span>Font size is too small for comfortable reading</span>
            </li>
          )}
          {typography.fontSize >= 14 && typography.fontSize < 16 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Consider 16-20px for optimal body text readability</span>
            </li>
          )}
          {typography.fontSize > 22 && typography.fontSize <= 26 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Large font size—better suited for headings</span>
            </li>
          )}
          {typography.fontSize > 26 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Font size is very large for body text</span>
            </li>
          )}

          {/* Line height tips */}
          {typography.lineHeight < 1.3 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#F11617' }}>•</span>
              <span>Line height is too tight, text feels cramped</span>
            </li>
          )}
          {typography.lineHeight >= 1.3 && typography.lineHeight < 1.5 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Try 1.5-1.7 line height for better readability</span>
            </li>
          )}
          {typography.lineHeight > 1.9 && typography.lineHeight <= 2.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Line height is getting loose, may feel disconnected</span>
            </li>
          )}
          {typography.lineHeight > 2.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Excessive line height breaks reading flow</span>
            </li>
          )}

          {/* Line length tips */}
          {typography.paragraphWidth < 40 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#F11617' }}>•</span>
              <span>Lines are too short, disrupts reading rhythm</span>
            </li>
          )}
          {typography.paragraphWidth >= 40 && typography.paragraphWidth < 55 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Short lines—consider 55-75ch for body text</span>
            </li>
          )}
          {typography.paragraphWidth > 75 && typography.paragraphWidth <= 85 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Lines are getting long, may strain the eye</span>
            </li>
          )}
          {typography.paragraphWidth > 85 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Lines are too long, hard to track to next line</span>
            </li>
          )}

          {/* Letter spacing tips */}
          {typography.letterSpacing < -0.05 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Tight letter spacing reduces legibility</span>
            </li>
          )}
          {typography.letterSpacing > 0.05 && typography.letterSpacing <= 0.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Loose tracking—best reserved for headings</span>
            </li>
          )}
          {typography.letterSpacing > 0.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Excessive tracking hurts word recognition</span>
            </li>
          )}

          {/* Word spacing tips */}
          {typography.wordSpacing < -0.1 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Tight word spacing makes words run together</span>
            </li>
          )}
          {typography.wordSpacing > 0.15 && typography.wordSpacing <= 0.25 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Wide word spacing creates visual gaps</span>
            </li>
          )}
          {typography.wordSpacing > 0.25 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Excessive word spacing breaks text continuity</span>
            </li>
          )}

          {/* Font weight tips */}
          {typography.fontWeight < 300 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Very light weight may be hard to read</span>
            </li>
          )}
          {typography.fontWeight >= 300 && typography.fontWeight < 400 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Light weight can reduce contrast on some screens</span>
            </li>
          )}
          {typography.fontWeight > 500 && typography.fontWeight <= 600 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Semi-bold weight—better for emphasis than body</span>
            </li>
          )}
          {typography.fontWeight > 600 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Bold weight is fatiguing for extended reading</span>
            </li>
          )}

          {/* Text alignment tips */}
          {typography.textAlign === 'justify' && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FE5900' }}>•</span>
              <span>Justified text creates uneven word spacing</span>
            </li>
          )}
          {typography.textAlign === 'center' && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Center alignment is harder to scan for body text</span>
            </li>
          )}
          {typography.textAlign === 'right' && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#FFCE04' }}>•</span>
              <span>Right-aligned text slows down reading speed</span>
            </li>
          )}

          {/* Positive feedback */}
          {readingComfort >= 90 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#01A451' }}>✓</span>
              <span>Excellent typography settings for readability</span>
            </li>
          )}
          {readingComfort >= 75 && readingComfort < 90 && (
            <li className="flex items-start gap-1.5">
              <span style={{ color: '#0048FD' }}>✓</span>
              <span>Good settings—minor adjustments could help</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
