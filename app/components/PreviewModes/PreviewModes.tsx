'use client';

import { useState } from 'react';
import {
  ViewportPreset,
  VIEWPORT_PRESETS,
  TypographyGuides,
  LayoutSettings,
  TextLayer,
  LayerContent,
  DEFAULT_LAYER_CONTENT,
} from '../../types/typography';
import { Slider } from '../ui/Slider';
import { ColorPicker } from '../ui/ColorPicker';

import {
  CellphoneLine, PadLine, ComputerLine,
  CellphoneFill, PadFill, ComputerFill,
  AlignTopLine, AlignVerticalCenterLine, AlignArrowDownLine
} from '@mingcute/react';

interface PreviewModesProps {
  layout: LayoutSettings;
  onLayoutChange: <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => void;
  layerContent: LayerContent;
  onLayerContentChange: (layer: TextLayer, content: string) => void;
  viewport: ViewportPreset;
  onViewportChange: (viewport: ViewportPreset) => void;
  guides: TypographyGuides;
  onToggleGuide: (guide: keyof TypographyGuides) => void;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  hasBorder?: boolean;
}

function CollapsibleSection({ title, defaultOpen = true, children, hasBorder = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={hasBorder ? 'pt-3 border-t border-zinc-200' : ''}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ${
          isOpen ? 'max-h-[1000px] opacity-100 mt-3 overflow-visible' : 'max-h-0 opacity-0 mt-0 overflow-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const viewportOptions: Array<{ value: ViewportPreset; label: string }> = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'desktop', label: 'Desktop' },
];

const guideOptions: Array<{ value: keyof TypographyGuides; label: string }> = [
  { value: 'baselineGrid', label: 'Baseline Grid' },
  { value: 'lineBox', label: 'Line Box' },
  { value: 'xHeight', label: 'X-Height' },
];

const alignmentOptions: Array<{ value: LayoutSettings['alignment']; label: string }> = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'stretch', label: 'Stretch' },
];

export function PreviewModes({
  layout,
  onLayoutChange,
  layerContent,
  onLayerContentChange,
  viewport,
  onViewportChange,
  guides,
  onToggleGuide,
}: PreviewModesProps) {
  return (
    <div className="bg-white rounded-xl p-5 space-y-3 shadow-[0px_0px_0px_0.5px_rgba(0,0,0,0.1)]">
      <h2 className="text-sm font-semibold text-zinc-800">
        Preview Options
      </h2>

      {/* Layout Section */}
      <CollapsibleSection title="Layout" defaultOpen={true} hasBorder={false}>
        <div className="space-y-4">
          {/* Container Padding */}
          <Slider
            label="Container Padding"
            value={layout.padding}
            min={0}
            max={64}
            step={4}
            unit="px"
            onChange={(value) => onLayoutChange('padding', value)}
            defaultValue={32}
          />

          {/* Alignment Buttons */}
          <div>
            <label className="block text-xs text-zinc-500 mb-2">
              Alignment
            </label>
            <div className="flex gap-1">
              {alignmentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onLayoutChange('alignment', option.value)}
                  title={option.label}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md transition-colors ${
                    layout.alignment === option.value
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                  }`}
                >
                  <span className="flex items-center justify-center w-4 h-4 [&>svg]:w-full [&>svg]:h-full">
                    {option.value === 'start' && <AlignTopLine />}
                    {option.value === 'center' && <AlignVerticalCenterLine />}
                    {option.value === 'stretch' && <AlignArrowDownLine />}
                  </span>
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs text-zinc-500 mb-2">
              Background Color
            </label>
            <ColorPicker
              value={layout.backgroundColor}
              onChange={(color) => onLayoutChange('backgroundColor', color)}
              defaultValue="#FFF1D4"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Content Section */}
      <CollapsibleSection title="Content" defaultOpen={false}>
        <div className="space-y-3">
          {/* Heading Content */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500">
              Heading
            </label>
            <input
              type="text"
              value={layerContent.heading}
              onChange={(e) => onLayerContentChange('heading', e.target.value)}
              placeholder={DEFAULT_LAYER_CONTENT.heading}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
            />
          </div>

          {/* Paragraph Content */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500">
              Paragraph
            </label>
            <textarea
              value={layerContent.paragraph}
              onChange={(e) => onLayerContentChange('paragraph', e.target.value)}
              placeholder={DEFAULT_LAYER_CONTENT.paragraph}
              className="w-full h-20 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 resize-none outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
            />
          </div>

          {/* Caption Content */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500">
              Caption
            </label>
            <input
              type="text"
              value={layerContent.caption}
              onChange={(e) => onLayerContentChange('caption', e.target.value)}
              placeholder={DEFAULT_LAYER_CONTENT.caption}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Viewport Presets */}
      <CollapsibleSection title="Viewport Width" defaultOpen={true}>
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {viewportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onViewportChange(option.value)}
                title={`${option.label} (${VIEWPORT_PRESETS[option.value].width}px)`}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md transition-colors ${viewport === option.value
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                  }`}
              >
                <span className="flex items-center justify-center w-5 h-5 [&>svg]:w-full [&>svg]:h-full">
                  {option.value === 'mobile' && (viewport === 'mobile' ? <CellphoneFill /> : <CellphoneLine />)}
                  {option.value === 'tablet' && (viewport === 'tablet' ? <PadFill /> : <PadLine />)}
                  {option.value === 'desktop' && (viewport === 'desktop' ? <ComputerFill /> : <ComputerLine />)}
                </span>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            {VIEWPORT_PRESETS[viewport].label}
          </p>
        </div>
      </CollapsibleSection>

      {/* Typography Guides */}
      <CollapsibleSection title="Typography Guides" defaultOpen={false}>
        <div className="space-y-1.5">
          {guideOptions.map((guide) => (
            <label
              key={guide.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={guides[guide.value]}
                  onChange={() => onToggleGuide(guide.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-colors ${guides[guide.value]
                    ? 'bg-black border-black'
                    : 'bg-white border-zinc-300 group-hover:border-zinc-400'
                    }`}
                >
                  {guides[guide.value] && (
                    <svg
                      className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`text-sm transition-colors group-hover:text-zinc-800 ${guides[guide.value] ? 'font-medium text-black' : 'text-zinc-600'}`}>
                {guide.label}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
