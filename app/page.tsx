'use client';

import { useTypography } from './hooks/useTypography';
import { useFontLoader } from './hooks/useFontLoader';
import { useRecommendations } from './hooks/useRecommendations';
import {
  TypographyCanvas,
  TypographyControls,
  TypographyMetrics,
  PreviewModes,
  ExportPanel,
} from './components';

export default function Home() {
  const {
    typography,
    updateTypography,
    resetTypography,
    resetSingleValue,
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

  const recommendations = useRecommendations(typography);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-100 to-zinc-400 rounded-lg flex items-center justify-center">
              <span className="text-zinc-900 text-sm font-bold">Ty</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">Typography Sandbox</h1>
              <p className="text-xs text-zinc-500">Experiment with typography variables in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
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
              onResetValue={resetSingleValue}
              onResetAll={resetTypography}
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
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <p className="text-xs text-zinc-600 text-center">
            Typography Sandbox — A tool for experimenting with typography variables.
            Built with Next.js, Tailwind CSS, and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
