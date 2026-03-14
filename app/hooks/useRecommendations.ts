'use client';

import { useMemo } from 'react';
import { TypographyState } from '../types/typography';

export interface TypographyRecommendations {
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  paragraphWidth: number;
}

export function useRecommendations(typography: TypographyState): TypographyRecommendations {
  return useMemo(() => {
    const { fontSize, fontWeight } = typography;

    // Line Height recommendations based on font size
    // Larger text needs tighter line height, smaller text needs looser
    let recommendedLineHeight: number;
    if (fontSize <= 12) {
      recommendedLineHeight = 1.7;
    } else if (fontSize <= 16) {
      recommendedLineHeight = 1.6;
    } else if (fontSize <= 20) {
      recommendedLineHeight = 1.5;
    } else if (fontSize <= 28) {
      recommendedLineHeight = 1.4;
    } else if (fontSize <= 40) {
      recommendedLineHeight = 1.3;
    } else if (fontSize <= 60) {
      recommendedLineHeight = 1.2;
    } else {
      recommendedLineHeight = 1.1;
    }

    // Letter Spacing recommendations based on font size and weight
    // Display text (large) benefits from tighter tracking
    // Body text should have neutral tracking
    // Heavy weights can use slightly tighter tracking
    let recommendedLetterSpacing: number;
    if (fontSize <= 14) {
      recommendedLetterSpacing = 0.01;
    } else if (fontSize <= 20) {
      recommendedLetterSpacing = 0;
    } else if (fontSize <= 32) {
      recommendedLetterSpacing = -0.01;
    } else if (fontSize <= 48) {
      recommendedLetterSpacing = -0.02;
    } else if (fontSize <= 72) {
      recommendedLetterSpacing = -0.03;
    } else {
      recommendedLetterSpacing = -0.04;
    }

    // Adjust for weight - heavier weights can be tighter
    if (fontWeight >= 700) {
      recommendedLetterSpacing -= 0.005;
    } else if (fontWeight <= 300) {
      recommendedLetterSpacing += 0.005;
    }

    // Word Spacing - generally 0 is recommended
    // Slightly positive for justified text or condensed fonts
    const recommendedWordSpacing = 0;

    // Paragraph Width recommendations based on font size
    // Larger fonts can have wider lines, smaller fonts need narrower
    let recommendedParagraphWidth: number;
    if (fontSize <= 14) {
      recommendedParagraphWidth = 55;
    } else if (fontSize <= 18) {
      recommendedParagraphWidth = 65;
    } else if (fontSize <= 24) {
      recommendedParagraphWidth = 70;
    } else {
      recommendedParagraphWidth = 75;
    }

    // Font size recommendation is contextual - for body text 16-18px is ideal
    const recommendedFontSize = 18;

    return {
      fontSize: recommendedFontSize,
      letterSpacing: Math.round(recommendedLetterSpacing * 100) / 100,
      wordSpacing: recommendedWordSpacing,
      lineHeight: Math.round(recommendedLineHeight * 100) / 100,
      paragraphWidth: recommendedParagraphWidth,
    };
  }, [typography]);
}
