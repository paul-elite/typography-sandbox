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
