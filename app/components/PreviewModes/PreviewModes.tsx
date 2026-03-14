'use client';

import { PreviewMode, ViewportPreset, VIEWPORT_PRESETS, TypographyGuides } from '../../types/typography';

interface PreviewModesProps {
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  viewport: ViewportPreset;
  onViewportChange: (viewport: ViewportPreset) => void;
  guides: TypographyGuides;
  onToggleGuide: (guide: keyof TypographyGuides) => void;
}

import {
  CellphoneLine, PadLine, ComputerLine,
  CellphoneFill, PadFill, ComputerFill
} from '@mingcute/react';

const previewModes: Array<{ value: PreviewMode; label: string }> = [
  { value: 'word', label: 'Word' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'custom', label: 'Custom' },
];

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

export function PreviewModes({
  previewMode,
  onPreviewModeChange,
  customText,
  onCustomTextChange,
  viewport,
  onViewportChange,
  guides,
  onToggleGuide,
}: PreviewModesProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-5 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-800">
        Preview Options
      </h2>

      {/* Preview Mode */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">
          Preview Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {previewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onPreviewModeChange(mode.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${previewMode === mode.value
                ? 'bg-zinc-900 text-white font-medium'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Text Input */}
      {previewMode === 'custom' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700">
            Custom Text
          </label>
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Enter your custom text here..."
            className="w-full h-24 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Viewport Presets */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">
          Viewport Width
        </label>
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
              <span>
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

      {/* Typography Guides */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">
          Typography Guides
        </label>
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
                  className={`w-4 h-4 rounded border-2 transition-colors ${guides[guide.value]
                    ? 'bg-blue-500 border-blue-500'
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
              <span className="text-sm text-zinc-600 group-hover:text-zinc-800">
                {guide.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
