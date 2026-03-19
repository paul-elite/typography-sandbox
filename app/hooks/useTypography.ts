'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TypographyState,
  TextLayer,
  LayerTypography,
  LayoutSettings,
  LayerContent,
  TextHolderInstance,
  DEFAULT_HEADING_TYPOGRAPHY,
  DEFAULT_PARAGRAPH_TYPOGRAPHY,
  DEFAULT_CAPTION_TYPOGRAPHY,
  DEFAULT_LAYOUT,
  DEFAULT_LAYER_CONTENT,
  ViewportPreset,
  TypographyGuides,
  VIEWPORT_PRESETS,
} from '../types/typography';

const DEFAULT_LAYER_TYPOGRAPHY: LayerTypography = {
  heading: DEFAULT_HEADING_TYPOGRAPHY,
  paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
  caption: DEFAULT_CAPTION_TYPOGRAPHY,
};

export function useTypography() {
  const [instances, setInstances] = useState<TextHolderInstance[]>([
    {
      id: 'default-1',
      x: 40,
      y: 40,
      layerTypography: DEFAULT_LAYER_TYPOGRAPHY,
      layout: DEFAULT_LAYOUT,
      layerContent: { ...DEFAULT_LAYER_CONTENT },
    }
  ]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>('default-1');
  const [selectedLayer, setSelectedLayer] = useState<TextLayer | null>('paragraph');
  const [viewport, setViewport] = useState<ViewportPreset>('desktop');
  const [customViewportWidth, setCustomViewportWidth] = useState<number>(VIEWPORT_PRESETS.desktop.width);
  const [guides, setGuides] = useState<TypographyGuides>({
    baselineGrid: false,
    lineBox: false,
    xHeight: false,
  });

  const activeInstance = useMemo(() => {
    return instances.find(inst => inst.id === selectedInstanceId) || null;
  }, [instances, selectedInstanceId]);

  // Derived state to mimic the old return signature but scoped to the active instance
  const layerTypography = activeInstance?.layerTypography || DEFAULT_LAYER_TYPOGRAPHY;
  const layout = activeInstance?.layout || DEFAULT_LAYOUT;
  const layerContent = activeInstance?.layerContent || DEFAULT_LAYER_CONTENT;

  // Get the current layer's typography for convenience (default to paragraph if none selected)
  const typography = selectedLayer ? layerTypography[selectedLayer] : null;

  const addInstance = useCallback((x: number, y: number) => {
    setInstances(prev => {
      if (prev.length >= 5) return prev;
      
      const source = prev.find(i => i.id === selectedInstanceId) || prev[prev.length - 1] || {
        layerTypography: DEFAULT_LAYER_TYPOGRAPHY,
        layout: DEFAULT_LAYOUT,
        layerContent: DEFAULT_LAYER_CONTENT,
      };

      const newId = `instance-${Date.now()}`;
      const newInstance: TextHolderInstance = {
        id: newId,
        x,
        y,
        // Deep clone to prevent reference sharing
        layerTypography: JSON.parse(JSON.stringify(source.layerTypography)),
        layout: { ...source.layout },
        layerContent: { ...source.layerContent },
      };

      setSelectedInstanceId(newId);
      return [...prev, newInstance];
    });
  }, [selectedInstanceId]);

  const removeInstance = useCallback((id: string) => {
    setInstances(prev => {
      const next = prev.filter(inst => inst.id !== id);
      if (selectedInstanceId === id) {
        setSelectedInstanceId(next.length > 0 ? next[next.length - 1].id : null);
      }
      return next;
    });
  }, [selectedInstanceId]);

  const updateInstancePosition = useCallback((id: string, x: number, y: number) => {
    setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, x, y } : inst));
  }, []);

  const updateTypography = useCallback(<K extends keyof TypographyState>(
    key: K,
    value: TypographyState[K]
  ) => {
    if (!selectedLayer || !selectedInstanceId) return;
    setInstances(prev => prev.map(inst => {
      if (inst.id !== selectedInstanceId) return inst;
      return {
        ...inst,
        layerTypography: {
          ...inst.layerTypography,
          [selectedLayer]: { ...inst.layerTypography[selectedLayer], [key]: value }
        }
      };
    }));
  }, [selectedLayer, selectedInstanceId]);

  const resetTypography = useCallback(() => {
    if (!selectedLayer || !selectedInstanceId) return;
    const defaults: Record<TextLayer, TypographyState> = {
      heading: DEFAULT_HEADING_TYPOGRAPHY,
      paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
      caption: DEFAULT_CAPTION_TYPOGRAPHY,
    };
    setInstances(prev => prev.map(inst => {
      if (inst.id !== selectedInstanceId) return inst;
      return {
        ...inst,
        layerTypography: {
          ...inst.layerTypography,
          [selectedLayer]: defaults[selectedLayer]
        }
      };
    }));
  }, [selectedLayer, selectedInstanceId]);

  const resetSingleValue = useCallback(<K extends keyof TypographyState>(key: K) => {
    if (!selectedLayer || !selectedInstanceId) return;
    const defaults: Record<TextLayer, TypographyState> = {
      heading: DEFAULT_HEADING_TYPOGRAPHY,
      paragraph: DEFAULT_PARAGRAPH_TYPOGRAPHY,
      caption: DEFAULT_CAPTION_TYPOGRAPHY,
    };
    setInstances(prev => prev.map(inst => {
      if (inst.id !== selectedInstanceId) return inst;
      return {
        ...inst,
        layerTypography: {
          ...inst.layerTypography,
          [selectedLayer]: { ...inst.layerTypography[selectedLayer], [key]: defaults[selectedLayer][key] }
        }
      };
    }));
  }, [selectedLayer, selectedInstanceId]);

  const updateLayout = useCallback(<K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    if (!selectedInstanceId) return;
    setInstances(prev => prev.map(inst => {
      if (inst.id !== selectedInstanceId) return inst;
      return {
        ...inst,
        layout: { ...inst.layout, [key]: value }
      };
    }));
  }, [selectedInstanceId]);

  const updateLayerContent = useCallback((layer: TextLayer, content: string) => {
    if (!selectedInstanceId) return;
    setInstances(prev => prev.map(inst => {
      if (inst.id !== selectedInstanceId) return inst;
      return {
        ...inst,
        layerContent: { ...inst.layerContent, [layer]: content }
      };
    }));
  }, [selectedInstanceId]);

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
    instances,
    selectedInstanceId,
    setSelectedInstanceId,
    addInstance,
    removeInstance,
    updateInstancePosition,
    // Active instance state exposed directly for compatibility
    layerTypography,
    layout,
    updateLayout,
    layerContent,
    updateLayerContent,
    selectedLayer,
    setSelectedLayer,
    typography,
    updateTypography,
    resetTypography,
    resetSingleValue,
    // Viewport and guides
    viewport,
    setViewport,
    customViewportWidth,
    setCustomViewportWidth,
    guides,
    toggleGuide,
    // Metrics
    readingComfort,
    comfortLevel,
  };
}
