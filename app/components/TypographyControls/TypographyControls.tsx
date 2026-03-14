'use client';

import { TypographyState, DEFAULT_TYPOGRAPHY, TEXT_ALIGNMENTS } from '../../types/typography';
import { Slider } from '../ui/Slider';
import { FontSelector } from '../FontSelector/FontSelector';
import { FontOption } from '../../types/typography';
import { TypographyRecommendations } from '../../hooks/useRecommendations';

interface TypographyControlsProps {
  typography: TypographyState;
  recommendations: TypographyRecommendations;
  onUpdate: <K extends keyof TypographyState>(key: K, value: TypographyState[K]) => void;
  onResetAll: () => void;
  fonts: FontOption[];
  loadFont: (font: string) => void;
  loadingFont: string | null;
  isFontLoaded: (font: string) => boolean;
  getFontWeights: (font: string) => number[];
}

export function TypographyControls({
  typography,
  recommendations,
  onUpdate,
  onResetAll,
  fonts,
  loadFont,
  loadingFont,
  isFontLoaded,
  getFontWeights,
}: TypographyControlsProps) {
  const availableWeights = getFontWeights(typography.fontFamily);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
          Typography Controls
        </h2>
        <button
          onClick={onResetAll}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-5">
        {/* Font Family */}
        <FontSelector
          fonts={fonts}
          selectedFont={typography.fontFamily}
          onSelectFont={(font) => onUpdate('fontFamily', font)}
          loadFont={loadFont}
          loadingFont={loadingFont}
          isFontLoaded={isFontLoaded}
        />

        {/* Font Weight */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Font Weight
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableWeights.map((weight) => (
              <button
                key={weight}
                onClick={() => onUpdate('fontWeight', weight)}
                className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  typography.fontWeight === weight
                    ? 'bg-zinc-100 text-zinc-900 font-medium'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <Slider
          label="Font Size"
          value={typography.fontSize}
          min={8}
          max={120}
          step={1}
          unit="px"
          onChange={(value) => onUpdate('fontSize', value)}
          defaultValue={DEFAULT_TYPOGRAPHY.fontSize}
          recommendedValue={recommendations.fontSize}
          onApplyRecommended={() => onUpdate('fontSize', recommendations.fontSize)}
        />

        {/* Letter Spacing (Tracking) */}
        <Slider
          label="Letter Spacing"
          value={typography.letterSpacing}
          min={-0.2}
          max={0.5}
          step={0.01}
          unit="em"
          onChange={(value) => onUpdate('letterSpacing', value)}
          defaultValue={DEFAULT_TYPOGRAPHY.letterSpacing}
          recommendedValue={recommendations.letterSpacing}
          onApplyRecommended={() => onUpdate('letterSpacing', recommendations.letterSpacing)}
          formatValue={(v) => v.toFixed(2)}
        />

        {/* Word Spacing */}
        <Slider
          label="Word Spacing"
          value={typography.wordSpacing}
          min={-0.2}
          max={1}
          step={0.01}
          unit="em"
          onChange={(value) => onUpdate('wordSpacing', value)}
          defaultValue={DEFAULT_TYPOGRAPHY.wordSpacing}
          recommendedValue={recommendations.wordSpacing}
          onApplyRecommended={() => onUpdate('wordSpacing', recommendations.wordSpacing)}
          formatValue={(v) => v.toFixed(2)}
        />

        {/* Line Height */}
        <Slider
          label="Line Height"
          value={typography.lineHeight}
          min={0.8}
          max={3}
          step={0.05}
          onChange={(value) => onUpdate('lineHeight', value)}
          defaultValue={DEFAULT_TYPOGRAPHY.lineHeight}
          recommendedValue={recommendations.lineHeight}
          onApplyRecommended={() => onUpdate('lineHeight', recommendations.lineHeight)}
          formatValue={(v) => v.toFixed(2)}
        />

        {/* Paragraph Width */}
        <Slider
          label="Paragraph Width"
          value={typography.paragraphWidth}
          min={20}
          max={120}
          step={1}
          unit="ch"
          onChange={(value) => onUpdate('paragraphWidth', value)}
          defaultValue={DEFAULT_TYPOGRAPHY.paragraphWidth}
          recommendedValue={recommendations.paragraphWidth}
          onApplyRecommended={() => onUpdate('paragraphWidth', recommendations.paragraphWidth)}
        />

        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Text Alignment
          </label>
          <div className="flex gap-1">
            {TEXT_ALIGNMENTS.map((alignment) => (
              <button
                key={alignment.value}
                onClick={() => onUpdate('textAlign', alignment.value)}
                title={alignment.label}
                className={`flex-1 py-2 text-lg rounded-md transition-colors ${
                  typography.textAlign === alignment.value
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                }`}
              >
                {alignment.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
