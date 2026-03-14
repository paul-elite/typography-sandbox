'use client';

import {
  TypographyState,
  TextLayer,
  DEFAULT_HEADING_TYPOGRAPHY,
  DEFAULT_PARAGRAPH_TYPOGRAPHY,
  DEFAULT_CAPTION_TYPOGRAPHY,
  TEXT_ALIGNMENTS,
} from '../../types/typography';
import { Slider } from '../ui/Slider';
import { FontSelector } from '../FontSelector/FontSelector';
import { FontOption } from '../../types/typography';
import { TypographyRecommendations, ActiveSlider } from '../../hooks/useRecommendations';
import { motion } from 'framer-motion';
import {
  AlignLeftLine, AlignCenterLine, AlignRightLine, AlignJustifyLine,
  AlignLeftFill, AlignCenterFill, AlignRightFill, AlignJustifyFill
} from '@mingcute/react';

interface TypographyControlsProps {
  typography: TypographyState;
  selectedLayer: TextLayer;
  onSelectLayer: (layer: TextLayer) => void;
  recommendations: TypographyRecommendations;
  onUpdate: <K extends keyof TypographyState>(key: K, value: TypographyState[K]) => void;
  onResetAll: () => void;
  onActiveSliderChange: (slider: ActiveSlider) => void;
  fonts: FontOption[];
  loadFont: (font: string) => void;
  loadingFont: string | null;
  isFontLoaded: (font: string) => boolean;
  getFontWeights: (font: string) => number[];
}

const LAYER_TABS: Array<{ value: TextLayer; label: string }> = [
  { value: 'heading', label: 'Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'caption', label: 'Caption' },
];

const DEFAULT_TYPOGRAPHY_BY_LAYER: Record<TextLayer, TypographyState> = {
  heading: DEFAULT_HEADING_TYPOGRAPHY,
  paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
  caption: DEFAULT_CAPTION_TYPOGRAPHY,
};

export function TypographyControls({
  typography,
  selectedLayer,
  onSelectLayer,
  recommendations,
  onUpdate,
  onResetAll,
  onActiveSliderChange,
  fonts,
  loadFont,
  loadingFont,
  isFontLoaded,
  getFontWeights,
}: TypographyControlsProps) {
  const availableWeights = getFontWeights(typography.fontFamily);
  const defaultTypography = DEFAULT_TYPOGRAPHY_BY_LAYER[selectedLayer];

  return (
    <div className="bg-white rounded-xl p-5 space-y-6 shadow-[0px_0px_0px_0.5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800">
          Typography Controls
        </h2>
        <button
          onClick={onResetAll}
          className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors px-2 py-1 rounded hover:bg-zinc-100"
        >
          Reset Layer
        </button>
      </div>

      {/* Layer Selector Tabs */}
      <div className="flex rounded-lg bg-zinc-100 p-1">
        {LAYER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onSelectLayer(tab.value)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
              selectedLayer === tab.value
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
        <Slider
          label="Font Weight"
          value={typography.fontWeight}
          min={availableWeights.length > 0 ? Math.min(...availableWeights) : 100}
          max={availableWeights.length > 0 ? Math.max(...availableWeights) : 900}
          step={100}
          onChange={(value) => onUpdate('fontWeight', value)}
          defaultValue={defaultTypography.fontWeight}
          recommendedValue={recommendations.fontWeight}
          onApplyRecommended={() => {
            const midpoint = (recommendations.fontWeight[0] + recommendations.fontWeight[1]) / 2;
            onUpdate('fontWeight', Math.round(midpoint / 100) * 100);
          }}
          onSlideStart={() => onActiveSliderChange('fontWeight')}
          onSlideEnd={() => onActiveSliderChange(null)}
        />

        {/* Font Size */}
        <Slider
          label="Font Size"
          value={typography.fontSize}
          min={8}
          max={120}
          step={1}
          unit="px"
          onChange={(value) => onUpdate('fontSize', value)}
          defaultValue={defaultTypography.fontSize}
          recommendedValue={recommendations.fontSize}
          onApplyRecommended={() => {
            const midpoint = (recommendations.fontSize[0] + recommendations.fontSize[1]) / 2;
            onUpdate('fontSize', Math.round(midpoint));
          }}
          onSlideStart={() => onActiveSliderChange('fontSize')}
          onSlideEnd={() => onActiveSliderChange(null)}
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
          defaultValue={defaultTypography.letterSpacing}
          recommendedValue={recommendations.letterSpacing}
          onApplyRecommended={() => {
            const midpoint = (recommendations.letterSpacing[0] + recommendations.letterSpacing[1]) / 2;
            onUpdate('letterSpacing', Math.round(midpoint * 100) / 100);
          }}
          onSlideStart={() => onActiveSliderChange('letterSpacing')}
          onSlideEnd={() => onActiveSliderChange(null)}
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
          defaultValue={defaultTypography.wordSpacing}
          recommendedValue={recommendations.wordSpacing}
          onApplyRecommended={() => {
            const midpoint = (recommendations.wordSpacing[0] + recommendations.wordSpacing[1]) / 2;
            onUpdate('wordSpacing', Math.round(midpoint * 100) / 100);
          }}
          onSlideStart={() => onActiveSliderChange('wordSpacing')}
          onSlideEnd={() => onActiveSliderChange(null)}
          formatValue={(v) => v.toFixed(2)}
        />

        {/* Line Height */}
        <Slider
          label="Line Height"
          value={typography.lineHeight}
          min={0.8}
          max={3}
          step={0.05}
          unit="pt"
          onChange={(value) => onUpdate('lineHeight', value)}
          defaultValue={defaultTypography.lineHeight}
          recommendedValue={recommendations.lineHeight}
          onApplyRecommended={() => {
            const midpoint = (recommendations.lineHeight[0] + recommendations.lineHeight[1]) / 2;
            onUpdate('lineHeight', Math.round(midpoint * 100) / 100);
          }}
          onSlideStart={() => onActiveSliderChange('lineHeight')}
          onSlideEnd={() => onActiveSliderChange(null)}
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
          defaultValue={defaultTypography.paragraphWidth}
          recommendedValue={recommendations.paragraphWidth}
          onApplyRecommended={() => {
            const midpoint = (recommendations.paragraphWidth[0] + recommendations.paragraphWidth[1]) / 2;
            onUpdate('paragraphWidth', Math.round(midpoint));
          }}
          onSlideStart={() => onActiveSliderChange('paragraphWidth')}
          onSlideEnd={() => onActiveSliderChange(null)}
        />

        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Text Alignment
          </label>
          <div className="flex gap-1">
            {TEXT_ALIGNMENTS.map((alignment) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                key={alignment.value}
                onClick={() => onUpdate('textAlign', alignment.value)}
                title={alignment.label}
                className={`flex-1 py-2 text-lg rounded-md transition-colors ${typography.textAlign === alignment.value
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                  }`}
              >
                {alignment.value === 'left' && (typography.textAlign === 'left' ? <AlignLeftFill className="mx-auto" /> : <AlignLeftLine className="mx-auto" />)}
                {alignment.value === 'center' && (typography.textAlign === 'center' ? <AlignCenterFill className="mx-auto" /> : <AlignCenterLine className="mx-auto" />)}
                {alignment.value === 'right' && (typography.textAlign === 'right' ? <AlignRightFill className="mx-auto" /> : <AlignRightLine className="mx-auto" />)}
                {alignment.value === 'justify' && (typography.textAlign === 'justify' ? <AlignJustifyFill className="mx-auto" /> : <AlignJustifyLine className="mx-auto" />)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Text Color
          </label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={typography.textColor}
                onChange={(e) => onUpdate('textColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-300 cursor-pointer bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
              />
            </div>
            <input
              type="text"
              value={typography.textColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                  onUpdate('textColor', value || '#000000');
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
                  onUpdate('textColor', defaultTypography.textColor);
                }
              }}
              className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 font-mono uppercase outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
              placeholder="#000000"
              maxLength={7}
            />
            {typography.textColor !== defaultTypography.textColor && (
              <button
                onClick={() => onUpdate('textColor', defaultTypography.textColor)}
                className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors px-2 py-1 rounded hover:bg-zinc-100"
                title="Reset to default"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
