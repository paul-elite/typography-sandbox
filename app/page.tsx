'use client';

import { useState } from 'react';
import { useTypography } from './hooks/useTypography';
import { useFontLoader } from './hooks/useFontLoader';
import { useRecommendations, ActiveSlider } from './hooks/useRecommendations';
import {
  TypographyCanvas,
  TypographyControls,
  TypographyMetrics,
  PreviewModes,
  ExportModal,
} from './components';

export default function Home() {
  const [activeSlider, setActiveSlider] = useState<ActiveSlider>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const {
    typography,
    updateTypography,
    resetTypography,
    previewMode,
    setPreviewMode,
    customText,
    setCustomText,
    previewText,
    viewport,
    setViewport,
    guides,
    toggleGuide,
    readingComfort,
    comfortLevel,
  } = useTypography();

  const {
    fonts,
    loadFont,
    loadingFont,
    isFontLoaded,
    getFontWeights,
  } = useFontLoader();

  const recommendations = useRecommendations(typography, activeSlider);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Design Tales Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Controls */}
          <aside className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">
            <TypographyControls
              typography={typography}
              recommendations={recommendations}
              onUpdate={updateTypography}
              onResetAll={resetTypography}
              onActiveSliderChange={setActiveSlider}
              fonts={fonts}
              loadFont={loadFont}
              loadingFont={loadingFont}
              isFontLoaded={isFontLoaded}
              getFontWeights={getFontWeights}
            />
          </aside>

          {/* Center - Canvas */}
          <section className="flex-1 min-h-[500px] flex flex-col">
            <TypographyCanvas
              typography={typography}
              previewText={previewText}
              viewport={viewport}
              guides={guides}
              isFontLoaded={isFontLoaded(typography.fontFamily)}
            />
          </section>

          {/* Right Sidebar - Options & Metrics */}
          <aside className="w-full lg:w-72 xl:w-80 space-y-4 flex-shrink-0">
            <PreviewModes
              previewMode={previewMode}
              onPreviewModeChange={setPreviewMode}
              customText={customText}
              onCustomTextChange={setCustomText}
              viewport={viewport}
              onViewportChange={setViewport}
              guides={guides}
              onToggleGuide={toggleGuide}
            />

            <TypographyMetrics
              typography={typography}
              readingComfort={readingComfort}
              comfortLevel={comfortLevel}
            />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 mt-12 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <p className="text-xs text-zinc-500 text-center">
            Design Tales © 2026
          </p>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        typography={typography}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
