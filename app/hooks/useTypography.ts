'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TypographyState,
  DEFAULT_TYPOGRAPHY,
  PreviewMode,
  ViewportPreset,
  TypographyGuides,
  PREVIEW_TEXTS,
} from '../types/typography';

export function useTypography() {
  const [typography, setTypography] = useState<TypographyState>(DEFAULT_TYPOGRAPHY);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('paragraph');
  const [customText, setCustomText] = useState('');
  const [viewport, setViewport] = useState<ViewportPreset>('desktop');
  const [guides, setGuides] = useState<TypographyGuides>({
    baselineGrid: false,
    lineBox: false,
    xHeight: false,
  });

  const updateTypography = useCallback(<K extends keyof TypographyState>(
    key: K,
    value: TypographyState[K]
  ) => {
    setTypography(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetTypography = useCallback(() => {
    setTypography(DEFAULT_TYPOGRAPHY);
  }, []);

  const resetSingleValue = useCallback(<K extends keyof TypographyState>(key: K) => {
    setTypography(prev => ({ ...prev, [key]: DEFAULT_TYPOGRAPHY[key] }));
  }, []);

  const toggleGuide = useCallback((guide: keyof TypographyGuides) => {
    setGuides(prev => ({ ...prev, [guide]: !prev[guide] }));
  }, []);

  const previewText = useMemo(() => {
    if (previewMode === 'custom') {
      return customText || 'Enter your custom text...';
    }
    return PREVIEW_TEXTS[previewMode];
  }, [previewMode, customText]);

  const readingComfort = useMemo(() => {
    const { fontSize, lineHeight, paragraphWidth, letterSpacing } = typography;

    let score = 100;

    // Font size scoring (optimal: 16-20px)
    if (fontSize < 14) score -= 20;
    else if (fontSize < 16) score -= 10;
    else if (fontSize > 24) score -= 10;
    else if (fontSize > 32) score -= 20;

    // Line height scoring (optimal: 1.4-1.6)
    if (lineHeight < 1.2) score -= 25;
    else if (lineHeight < 1.4) score -= 10;
    else if (lineHeight > 2) score -= 15;

    // Line length scoring (optimal: 50-75 characters)
    if (paragraphWidth < 40) score -= 20;
    else if (paragraphWidth < 50) score -= 10;
    else if (paragraphWidth > 80) score -= 15;
    else if (paragraphWidth > 90) score -= 25;

    // Letter spacing scoring (optimal: -0.5 to 0.5)
    if (Math.abs(letterSpacing) > 2) score -= 15;
    else if (Math.abs(letterSpacing) > 1) score -= 5;

    return Math.max(0, Math.min(100, score));
  }, [typography]);

  const comfortLevel = useMemo(() => {
    if (readingComfort >= 80) return { label: 'Excellent', color: 'text-green-500' };
    if (readingComfort >= 60) return { label: 'Good', color: 'text-emerald-500' };
    if (readingComfort >= 40) return { label: 'Fair', color: 'text-yellow-500' };
    if (readingComfort >= 20) return { label: 'Poor', color: 'text-orange-500' };
    return { label: 'Very Poor', color: 'text-red-500' };
  }, [readingComfort]);

  return {
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
  };
}
