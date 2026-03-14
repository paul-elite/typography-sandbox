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

const previewModes: Array<{ value: PreviewMode; label: string }> = [
  { value: 'word', label: 'Word' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'custom', label: 'Custom' },
];

const viewportOptions: Array<{ value: ViewportPreset; label: string; icon: string }> = [
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'tablet', label: 'Tablet', icon: '⬜' },
  { value: 'desktop', label: 'Desktop', icon: '🖥️' },
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Preview Options
      </h2>

      {/* Preview Mode */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Preview Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {previewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onPreviewModeChange(mode.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                previewMode === mode.value
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
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
          <label className="block text-sm font-medium text-zinc-300">
            Custom Text
          </label>
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Enter your custom text here..."
            className="w-full h-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      )}

      {/* Viewport Presets */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Viewport Width
        </label>
        <div className="flex gap-1.5">
          {viewportOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onViewportChange(option.value)}
              title={`${option.label} (${VIEWPORT_PRESETS[option.value].width}px)`}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md transition-colors ${
                viewport === option.value
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
              }`}
            >
              <span>{option.icon}</span>
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
        <label className="block text-sm font-medium text-zinc-300">
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
                  className={`w-4 h-4 rounded border transition-colors ${
                    guides[guide.value]
                      ? 'bg-zinc-100 border-zinc-100'
                      : 'bg-zinc-800 border-zinc-600 group-hover:border-zinc-500'
                  }`}
                >
                  {guides[guide.value] && (
                    <svg
                      className="w-4 h-4 text-zinc-900"
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
              <span className="text-sm text-zinc-400 group-hover:text-zinc-300">
                {guide.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
