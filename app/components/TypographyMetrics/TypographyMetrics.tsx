'use client';

import { TypographyState } from '../../types/typography';

interface TypographyMetricsProps {
  typography: TypographyState;
  readingComfort: number;
  comfortLevel: { label: string; color: string };
}

export function TypographyMetrics({
  typography,
  readingComfort,
  comfortLevel,
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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Typography Metrics
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between items-baseline">
            <span className="text-xs text-zinc-500">{metric.label}</span>
            <span className="text-sm text-zinc-300 font-mono">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">Reading Comfort</span>
          <span className={`text-sm font-medium ${comfortLevel.color}`}>
            {comfortLevel.label}
          </span>
        </div>
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
            style={{ width: `${readingComfort}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-zinc-800 transition-all duration-300"
            style={{ left: `calc(${readingComfort}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-zinc-600">Poor</span>
          <span className="text-[10px] text-zinc-600">Excellent</span>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800 space-y-2">
        <h3 className="text-xs font-medium text-zinc-400">Quick Tips</h3>
        <ul className="text-xs text-zinc-500 space-y-1">
          {typography.fontSize < 16 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              <span>Consider increasing font size for better readability</span>
            </li>
          )}
          {typography.lineHeight < 1.4 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              <span>Line height below 1.4 may reduce readability</span>
            </li>
          )}
          {typography.paragraphWidth > 80 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              <span>Line length over 80ch can strain the eye</span>
            </li>
          )}
          {typography.paragraphWidth < 45 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              <span>Very short lines can disrupt reading rhythm</span>
            </li>
          )}
          {Math.abs(typography.letterSpacing) > 0.1 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500">•</span>
              <span>Extreme letter spacing affects legibility</span>
            </li>
          )}
          {readingComfort >= 80 && (
            <li className="flex items-start gap-1.5">
              <span className="text-green-500">✓</span>
              <span>Typography settings are well-optimized</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
