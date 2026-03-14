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
  ExportPanel,
} from './components';

export default function Home() {
  const [activeSlider, setActiveSlider] = useState<ActiveSlider>(null);

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
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">Ty</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900">Typography Sandbox</h1>
              <p className="text-xs text-zinc-500">Experiment with typography variables in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Powered by Google Fonts
            </a>
          </div>
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

            <ExportPanel typography={typography} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 mt-12 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <p className="text-xs text-zinc-500 text-center">
            Typography Sandbox — A tool for experimenting with typography variables.
            Built with Next.js, Tailwind CSS, and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
