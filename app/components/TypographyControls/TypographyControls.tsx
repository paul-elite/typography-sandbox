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
import { ColorPicker } from '../ui/ColorPicker';
import { FontSelector } from '../FontSelector/FontSelector';
import { FontOption } from '../../types/typography';
import { TypographyRecommendations, ActiveSlider } from '../../hooks/useRecommendations';
import { motion } from 'framer-motion';
import {
  AlignLeftLine, AlignCenterLine, AlignRightLine, AlignJustifyLine,
  AlignLeftFill, AlignCenterFill, AlignRightFill, AlignJustifyFill
} from '@mingcute/react';

interface TypographyControlsProps {
  typography: TypographyState | null;
  selectedLayer: TextLayer | null;
  recommendations: TypographyRecommendations | null;
  onUpdate: <K extends keyof TypographyState>(key: K, value: TypographyState[K]) => void;
  onResetAll: () => void;
  onActiveSliderChange: (slider: ActiveSlider) => void;
  fonts: FontOption[];
  loadFont: (font: string) => void;
  loadingFont: string | null;
  isFontLoaded: (font: string) => boolean;
  getFontWeights: (font: string) => number[];
}

const LAYER_LABELS: Record<TextLayer, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  caption: 'Caption',
};

const DEFAULT_TYPOGRAPHY_BY_LAYER: Record<TextLayer, TypographyState> = {
  heading: DEFAULT_HEADING_TYPOGRAPHY,
  paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
  caption: DEFAULT_CAPTION_TYPOGRAPHY,
};

export function TypographyControls({
  typography,
  selectedLayer,
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
  const availableWeights = typography ? getFontWeights(typography.fontFamily) : [];
  const defaultTypography = selectedLayer ? DEFAULT_TYPOGRAPHY_BY_LAYER[selectedLayer] : null;

  return (
    <div className="bg-white rounded-xl p-5 space-y-6 shadow-[0px_0px_0px_0.5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-800">
            Typography Controls
          </h2>
          {selectedLayer && (
            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              {LAYER_LABELS[selectedLayer]}
            </span>
          )}
        </div>
        {selectedLayer && (
          <button
            onClick={onResetAll}
            className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors px-2 py-1 rounded hover:bg-zinc-100"
          >
            Reset Layer
          </button>
        )}
      </div>

      {/* No Selection State */}
      {!selectedLayer || !typography || !defaultTypography ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 mb-1">No layer selected</p>
          <p className="text-xs text-zinc-400">Click on a text layer in the canvas to edit it</p>
        </div>
      ) : (
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
            recommendedValue={recommendations?.fontWeight}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.fontWeight[0] + recommendations.fontWeight[1]) / 2;
                onUpdate('fontWeight', Math.round(midpoint / 100) * 100);
              }
            }}
            onSlideStart={() => onActiveSliderChange('fontWeight')}
            onSlideEnd={() => onActiveSliderChange(null)}
            formatValue={(v) => {
              const weights: Record<number, string> = {
                100: 'Thin',
                200: 'Extra Light',
                300: 'Light',
                400: 'Regular',
                500: 'Medium',
                600: 'Semi Bold',
                700: 'Bold',
                800: 'Extra Bold',
                900: 'Black',
              };
              return weights[v] || v.toString();
            }}
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
            recommendedValue={recommendations?.fontSize}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.fontSize[0] + recommendations.fontSize[1]) / 2;
                onUpdate('fontSize', Math.round(midpoint));
              }
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
            recommendedValue={recommendations?.letterSpacing}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.letterSpacing[0] + recommendations.letterSpacing[1]) / 2;
                onUpdate('letterSpacing', Math.round(midpoint * 100) / 100);
              }
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
            recommendedValue={recommendations?.wordSpacing}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.wordSpacing[0] + recommendations.wordSpacing[1]) / 2;
                onUpdate('wordSpacing', Math.round(midpoint * 100) / 100);
              }
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
            recommendedValue={recommendations?.lineHeight}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.lineHeight[0] + recommendations.lineHeight[1]) / 2;
                onUpdate('lineHeight', Math.round(midpoint * 100) / 100);
              }
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
            recommendedValue={recommendations?.paragraphWidth}
            onApplyRecommended={() => {
              if (recommendations) {
                const midpoint = (recommendations.paragraphWidth[0] + recommendations.paragraphWidth[1]) / 2;
                onUpdate('paragraphWidth', Math.round(midpoint));
              }
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
            <ColorPicker
              value={typography.textColor}
              onChange={(color) => onUpdate('textColor', color)}
              defaultValue={defaultTypography.textColor}
            />
          </div>
        </div>
      )}
    </div>
  );
}
