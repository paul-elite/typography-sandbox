'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TypographyState,
  TextLayer,
  LayerTypography,
  LayoutSettings,
  LayerContent,
  DEFAULT_HEADING_TYPOGRAPHY,
  DEFAULT_PARAGRAPH_TYPOGRAPHY,
  DEFAULT_CAPTION_TYPOGRAPHY,
  DEFAULT_LAYOUT,
  DEFAULT_LAYER_CONTENT,
  ViewportPreset,
  TypographyGuides,
} from '../types/typography';

const DEFAULT_LAYER_TYPOGRAPHY: LayerTypography = {
  heading: DEFAULT_HEADING_TYPOGRAPHY,
  paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
  caption: DEFAULT_CAPTION_TYPOGRAPHY,
};

export function useTypography() {
  const [layerTypography, setLayerTypography] = useState<LayerTypography>(DEFAULT_LAYER_TYPOGRAPHY);
  const [selectedLayer, setSelectedLayer] = useState<TextLayer | null>('paragraph');
  const [layout, setLayout] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [layerContent, setLayerContent] = useState<LayerContent>({ ...DEFAULT_LAYER_CONTENT });
  const [viewport, setViewport] = useState<ViewportPreset>('desktop');
  const [guides, setGuides] = useState<TypographyGuides>({
    baselineGrid: false,
    lineBox: false,
    xHeight: false,
  });

  // Get the current layer's typography for convenience (default to paragraph if none selected)
  const typography = selectedLayer ? layerTypography[selectedLayer] : null;

  const updateTypography = useCallback(<K extends keyof TypographyState>(
    key: K,
    value: TypographyState[K]
  ) => {
    if (!selectedLayer) return;
    setLayerTypography(prev => ({
      ...prev,
      [selectedLayer]: { ...prev[selectedLayer], [key]: value }
    }));
  }, [selectedLayer]);

  const resetTypography = useCallback(() => {
    if (!selectedLayer) return;
    // Reset only the selected layer
    const defaults: Record<TextLayer, TypographyState> = {
      heading: DEFAULT_HEADING_TYPOGRAPHY,
      paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
      caption: DEFAULT_CAPTION_TYPOGRAPHY,
    };
    setLayerTypography(prev => ({
      ...prev,
      [selectedLayer]: defaults[selectedLayer]
    }));
  }, [selectedLayer]);

  const resetSingleValue = useCallback(<K extends keyof TypographyState>(key: K) => {
    if (!selectedLayer) return;
    const defaults: Record<TextLayer, TypographyState> = {
      heading: DEFAULT_HEADING_TYPOGRAPHY,
      paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
      caption: DEFAULT_CAPTION_TYPOGRAPHY,
    };
    setLayerTypography(prev => ({
      ...prev,
      [selectedLayer]: { ...prev[selectedLayer], [key]: defaults[selectedLayer][key] }
    }));
  }, [selectedLayer]);

  const updateLayout = useCallback(<K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    setLayout(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateLayerContent = useCallback((layer: TextLayer, content: string) => {
    setLayerContent(prev => ({ ...prev, [layer]: content }));
  }, []);

  const toggleGuide = useCallback((guide: keyof TypographyGuides) => {
    setGuides(prev => ({ ...prev, [guide]: !prev[guide] }));
  }, []);

  const readingComfort = useMemo(() => {
    if (!typography) return 0;
    const { fontSize, lineHeight, paragraphWidth, letterSpacing, wordSpacing, fontWeight, textAlign } = typography;

    let score = 100;

    // Font size scoring (optimal: 16-20px for body text)
    if (fontSize < 12) score -= 30;
    else if (fontSize < 14) score -= 20;
    else if (fontSize < 16) score -= 12;
    else if (fontSize > 22) score -= 8;
    else if (fontSize > 26) score -= 15;
    else if (fontSize > 32) score -= 25;

    // Line height scoring (optimal: 1.5-1.7 for body text)
    if (lineHeight < 1.2) score -= 30;
    else if (lineHeight < 1.4) score -= 18;
    else if (lineHeight < 1.5) score -= 8;
    else if (lineHeight > 1.8) score -= 8;
    else if (lineHeight > 2.0) score -= 15;
    else if (lineHeight > 2.2) score -= 25;

    // Line length scoring (optimal: 55-75 characters)
    if (paragraphWidth < 35) score -= 25;
    else if (paragraphWidth < 45) score -= 15;
    else if (paragraphWidth < 55) score -= 8;
    else if (paragraphWidth > 75) score -= 8;
    else if (paragraphWidth > 85) score -= 18;
    else if (paragraphWidth > 95) score -= 28;

    // Letter spacing scoring (optimal: -0.02 to 0.02em for body)
    if (Math.abs(letterSpacing) > 0.15) score -= 20;
    else if (Math.abs(letterSpacing) > 0.08) score -= 12;
    else if (Math.abs(letterSpacing) > 0.04) score -= 6;

    // Word spacing scoring (optimal: 0 to 0.1em)
    if (Math.abs(wordSpacing) > 0.3) score -= 18;
    else if (Math.abs(wordSpacing) > 0.2) score -= 12;
    else if (Math.abs(wordSpacing) > 0.1) score -= 6;

    // Font weight scoring (optimal: 400-500 for body)
    if (fontWeight < 300) score -= 15;
    else if (fontWeight < 400) score -= 8;
    else if (fontWeight > 600) score -= 10;
    else if (fontWeight > 700) score -= 18;

    // Text alignment scoring
    if (textAlign === 'justify') score -= 12;
    else if (textAlign === 'center') score -= 8;
    else if (textAlign === 'right') score -= 5;

    return Math.max(0, Math.min(100, score));
  }, [typography]);

  const comfortLevel = useMemo(() => {
    if (readingComfort >= 83.33) return { label: 'Excellent', color: 'text-[#00B82E]' };
    if (readingComfort >= 66.67) return { label: 'Very Good', color: 'text-[#2599F8]' };
    if (readingComfort >= 50) return { label: 'Good', color: 'text-[#2AC0EE]' };
    if (readingComfort >= 33.33) return { label: 'Fair', color: 'text-[#FEB61D]' };
    if (readingComfort >= 16.67) return { label: 'Poor', color: 'text-[#FE5722]' };
    return { label: 'Very Poor', color: 'text-[#FA181C]' };
  }, [readingComfort]);

  return {
    // Multi-layer state
    layerTypography,
    selectedLayer,
    setSelectedLayer,
    layout,
    updateLayout,
    layerContent,
    updateLayerContent,
    // Current layer's typography (for convenience)
    typography,
    updateTypography,
    resetTypography,
    resetSingleValue,
    // Viewport and guides
    viewport,
    setViewport,
    guides,
    toggleGuide,
    // Metrics
    readingComfort,
    comfortLevel,
  };
}
