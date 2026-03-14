'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
    // Multi-layer state
    layerTypography,
    selectedLayer,
    setSelectedLayer,
    layout,
    updateLayout,
    layerContent,
    updateLayerContent,
    // Current layer's typography
    typography,
    updateTypography,
    resetTypography,
    // Viewport and guides
    viewport,
    setViewport,
    guides,
    toggleGuide,
    // Metrics
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
      <main className="max-w-[1800px] mx-auto p-6 h-[calc(100vh-73px)] flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* Left Sidebar - Controls */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto"
          >
            <div className="space-y-4">
              <TypographyControls
                typography={typography}
                selectedLayer={selectedLayer}
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
            </div>
          </motion.aside>

          {/* Center - Canvas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <TypographyCanvas
              layerTypography={layerTypography}
              selectedLayer={selectedLayer}
              onSelectLayer={setSelectedLayer}
              onTypographyChange={updateTypography}
              layout={layout}
              onLayoutChange={updateLayout}
              layerContent={layerContent}
              viewport={viewport}
              guides={guides}
              isFontLoaded={isFontLoaded}
            />
          </motion.section>

          {/* Right Sidebar - Options & Metrics */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
            className="w-full lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto"
          >
            <div className="space-y-4">
              <PreviewModes
                layout={layout}
                onLayoutChange={updateLayout}
                layerContent={layerContent}
                onLayerContentChange={updateLayerContent}
                viewport={viewport}
                onViewportChange={setViewport}
                guides={guides}
                onToggleGuide={toggleGuide}
              />

              <TypographyMetrics
                typography={typography}
                selectedLayer={selectedLayer}
                readingComfort={readingComfort}
                comfortLevel={comfortLevel}
              />
            </div>
          </motion.aside>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        layerTypography={layerTypography}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
