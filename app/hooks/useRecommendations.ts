'use client';

import { useMemo } from 'react';
import { TypographyState } from '../types/typography';

export interface TypographyRecommendations {
  fontSize: [number, number];
  fontWeight: [number, number];
  letterSpacing: [number, number];
  wordSpacing: [number, number];
  lineHeight: [number, number];
  paragraphWidth: [number, number];
}

export type ActiveSlider = keyof TypographyRecommendations | null;

export function useRecommendations(
  typography: TypographyState,
  activeSlider: ActiveSlider
): TypographyRecommendations {
  return useMemo(() => {
    const { fontSize, fontWeight, letterSpacing, lineHeight, paragraphWidth, wordSpacing, textAlign } = typography;

    // ============================================
    // FONT WEIGHT recommendation
    // ============================================
    let recommendedFontWeight: number;
    if (activeSlider === 'fontWeight') {
      recommendedFontWeight = fontWeight;
    } else {
      // Base from font size
      if (fontSize <= 14) {
        recommendedFontWeight = 400;
      } else if (fontSize <= 24) {
        recommendedFontWeight = 500;
      } else if (fontSize <= 48) {
        recommendedFontWeight = 600;
      } else {
        recommendedFontWeight = 700;
      }

      // Adjust for letter spacing
      if (letterSpacing < -0.02) {
        recommendedFontWeight += 100;
      } else if (letterSpacing > 0.05) {
        recommendedFontWeight -= 100;
      }

      recommendedFontWeight = Math.max(100, Math.min(900, recommendedFontWeight));
    }

    // ============================================
    // FONT SIZE recommendation
    // ============================================
    let recommendedFontSize: number;
    if (activeSlider === 'fontSize') {
      recommendedFontSize = fontSize;
    } else {
      // Based on paragraph width and line height
      const widthFactor = paragraphWidth / 65;
      const baseSize = 16 + (widthFactor - 1) * 4;

      if (lineHeight < 1.3) {
        recommendedFontSize = Math.round(baseSize * 1.5);
      } else if (lineHeight > 1.6) {
        recommendedFontSize = Math.round(baseSize * 0.9);
      } else {
        recommendedFontSize = Math.round(baseSize);
      }

      // Adjust based on letter spacing
      if (letterSpacing < -0.03) {
        recommendedFontSize += 8; // Tight tracking suggests display text
      } else if (letterSpacing > 0.02) {
        recommendedFontSize -= 2;
      }

      recommendedFontSize = Math.max(12, Math.min(72, recommendedFontSize));
    }

    // ============================================
    // LINE HEIGHT recommendation
    // ============================================
    let recommendedLineHeight: number;
    if (activeSlider === 'lineHeight') {
      recommendedLineHeight = lineHeight;
    } else {
      // Base from font size
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

      // Adjust for paragraph width
      if (paragraphWidth > 75) {
        recommendedLineHeight += 0.1;
      } else if (paragraphWidth < 50) {
        recommendedLineHeight -= 0.05;
      }

      // Adjust for letter spacing
      if (letterSpacing < -0.02) {
        recommendedLineHeight += 0.05;
      } else if (letterSpacing > 0.05) {
        recommendedLineHeight -= 0.05;
      }

      recommendedLineHeight = Math.max(1.0, Math.min(2.0, recommendedLineHeight));
    }

    // ============================================
    // LETTER SPACING recommendation
    // ============================================
    let recommendedLetterSpacing: number;
    if (activeSlider === 'letterSpacing') {
      recommendedLetterSpacing = letterSpacing;
    } else {
      // Base from font size
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

      // Adjust for weight
      if (fontWeight >= 700) {
        recommendedLetterSpacing -= 0.01;
      } else if (fontWeight <= 300) {
        recommendedLetterSpacing += 0.01;
      }

      // Adjust for line height
      if (lineHeight < 1.3) {
        recommendedLetterSpacing -= 0.005;
      } else if (lineHeight > 1.7) {
        recommendedLetterSpacing += 0.005;
      }

      recommendedLetterSpacing = Math.max(-0.1, Math.min(0.2, recommendedLetterSpacing));
    }

    // ============================================
    // WORD SPACING recommendation
    // ============================================
    let recommendedWordSpacing: number;
    if (activeSlider === 'wordSpacing') {
      recommendedWordSpacing = wordSpacing;
    } else {
      recommendedWordSpacing = 0;

      // Justified text benefits from more word spacing
      if (textAlign === 'justify') {
        recommendedWordSpacing = 0.05;
      }

      // Tight letter spacing can use more word spacing
      if (letterSpacing < -0.02) {
        recommendedWordSpacing += 0.02;
      }

      // Narrow paragraphs need less
      if (paragraphWidth < 45) {
        recommendedWordSpacing -= 0.02;
      }

      recommendedWordSpacing = Math.max(-0.1, Math.min(0.2, recommendedWordSpacing));
    }

    // ============================================
    // PARAGRAPH WIDTH recommendation
    // ============================================
    let recommendedParagraphWidth: number;
    if (activeSlider === 'paragraphWidth') {
      recommendedParagraphWidth = paragraphWidth;
    } else {
      // Base from font size
      if (fontSize <= 14) {
        recommendedParagraphWidth = 55;
      } else if (fontSize <= 18) {
        recommendedParagraphWidth = 65;
      } else if (fontSize <= 24) {
        recommendedParagraphWidth = 70;
      } else if (fontSize <= 36) {
        recommendedParagraphWidth = 50;
      } else {
        recommendedParagraphWidth = 40;
      }

      // Adjust for line height
      if (lineHeight > 1.6) {
        recommendedParagraphWidth += 5;
      } else if (lineHeight < 1.3) {
        recommendedParagraphWidth -= 10;
      }

      // Adjust for letter spacing
      if (letterSpacing > 0.02) {
        recommendedParagraphWidth -= 5;
      }

      recommendedParagraphWidth = Math.max(30, Math.min(90, recommendedParagraphWidth));
    }

    return {
      fontSize: [
        Math.max(8, recommendedFontSize - 2),
        Math.min(120, recommendedFontSize + 2)
      ],
      fontWeight: [
        Math.max(100, recommendedFontWeight - 100),
        Math.min(900, recommendedFontWeight + 100)
      ],
      letterSpacing: [
        Math.max(-0.2, Math.round((recommendedLetterSpacing - 0.01) * 100) / 100),
        Math.min(0.5, Math.round((recommendedLetterSpacing + 0.01) * 100) / 100)
      ],
      wordSpacing: [
        Math.max(-0.2, Math.round((recommendedWordSpacing - 0.02) * 100) / 100),
        Math.min(1, Math.round((recommendedWordSpacing + 0.02) * 100) / 100)
      ],
      lineHeight: [
        Math.max(0.8, Math.round((recommendedLineHeight - 0.1) * 100) / 100),
        Math.min(3, Math.round((recommendedLineHeight + 0.1) * 100) / 100)
      ],
      paragraphWidth: [
        Math.max(20, Math.round(recommendedParagraphWidth - 5)),
        Math.min(120, Math.round(recommendedParagraphWidth + 5))
      ],
    };
  }, [typography, activeSlider]);
}
