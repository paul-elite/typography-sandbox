'use client';

import { useEffect, useState, useCallback } from 'react';
import { FontOption, POPULAR_FONTS } from '../types/typography';

const loadedFonts = new Set<string>();

export function useFontLoader() {
  const [fonts] = useState<FontOption[]>(POPULAR_FONTS);
  const [loadingFont, setLoadingFont] = useState<string | null>(null);
  const [loadedFontsList, setLoadedFontsList] = useState<string[]>(['Inter']);

  const loadFont = useCallback(async (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) {
      return;
    }

    const font = fonts.find(f => f.family === fontFamily);
    if (!font) return;

    setLoadingFont(fontFamily);

    try {
      const weights = font.weights.join(';');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${weights}&display=swap`;

      // Check if link already exists
      const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
      if (existingLink) {
        loadedFonts.add(fontFamily);
        setLoadedFontsList(prev => [...new Set([...prev, fontFamily])]);
        setLoadingFont(null);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;

      await new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load font: ${fontFamily}`));
        document.head.appendChild(link);
      });

      // Wait for font to be ready
      await document.fonts.ready;

      loadedFonts.add(fontFamily);
      setLoadedFontsList(prev => [...new Set([...prev, fontFamily])]);
    } catch (error) {
      console.error(`Error loading font ${fontFamily}:`, error);
    } finally {
      setLoadingFont(null);
    }
  }, [fonts]);

  // Preload Inter font on mount
  useEffect(() => {
    loadFont('Inter');
  }, [loadFont]);

  const getFontWeights = useCallback((fontFamily: string): number[] => {
    const font = fonts.find(f => f.family === fontFamily);
    return font?.weights || [400];
  }, [fonts]);

  const getFontCategory = useCallback((fontFamily: string): string => {
    const font = fonts.find(f => f.family === fontFamily);
    return font?.category || 'sans-serif';
  }, [fonts]);

  const isFontLoaded = useCallback((fontFamily: string): boolean => {
    return loadedFontsList.includes(fontFamily);
  }, [loadedFontsList]);

  return {
    fonts,
    loadFont,
    loadingFont,
    loadedFontsList,
    getFontWeights,
    getFontCategory,
    isFontLoaded,
  };
}
