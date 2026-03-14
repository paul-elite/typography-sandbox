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
    const { fontSize, fontWeight, letterSpacing, lineHeight, paragraphWidth, wordSpacing, textAlign } = typography;

    // ============================================
    // FONT SIZE recommendation
    // Based on: paragraph width, line height
    // ============================================
    let recommendedFontSize: number;
    // Narrower paragraphs work better with smaller text
    // Wider paragraphs can handle larger text
    const widthFactor = paragraphWidth / 65; // 65ch is baseline
    const baseSize = 16 + (widthFactor - 1) * 4; // Scale around 16px

    // Adjust for line height - tighter line height suggests display text (larger)
    // Looser line height suggests body text (smaller)
    if (lineHeight < 1.3) {
      recommendedFontSize = Math.round(baseSize * 1.5); // Display text
    } else if (lineHeight > 1.6) {
      recommendedFontSize = Math.round(baseSize * 0.9); // Dense body text
    } else {
      recommendedFontSize = Math.round(baseSize);
    }
    recommendedFontSize = Math.max(12, Math.min(72, recommendedFontSize));

    // ============================================
    // LINE HEIGHT recommendation
    // Based on: font size, paragraph width, letter spacing
    // ============================================
    let recommendedLineHeight: number;

    // Base calculation from font size
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

    // Adjust for paragraph width - wider lines need more line height
    if (paragraphWidth > 75) {
      recommendedLineHeight += 0.1;
    } else if (paragraphWidth < 50) {
      recommendedLineHeight -= 0.05;
    }

    // Adjust for letter spacing - tighter tracking needs more line height
    if (letterSpacing < -0.02) {
      recommendedLineHeight += 0.05;
    } else if (letterSpacing > 0.05) {
      recommendedLineHeight -= 0.05;
    }

    recommendedLineHeight = Math.max(1.0, Math.min(2.0, recommendedLineHeight));

    // ============================================
    // LETTER SPACING recommendation
    // Based on: font size, font weight, line height
    // ============================================
    let recommendedLetterSpacing: number;

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

    // Adjust for line height - tighter line height (display) can have tighter tracking
    if (lineHeight < 1.3) {
      recommendedLetterSpacing -= 0.005;
    } else if (lineHeight > 1.7) {
      recommendedLetterSpacing += 0.005;
    }

    recommendedLetterSpacing = Math.max(-0.1, Math.min(0.2, recommendedLetterSpacing));

    // ============================================
    // WORD SPACING recommendation
    // Based on: text alignment, letter spacing, paragraph width
    // ============================================
    let recommendedWordSpacing = 0;

    // Justified text benefits from slightly more word spacing
    if (textAlign === 'justify') {
      recommendedWordSpacing = 0.05;
    }

    // Tight letter spacing can use slightly more word spacing for balance
    if (letterSpacing < -0.02) {
      recommendedWordSpacing += 0.02;
    }

    // Narrow paragraphs might need less word spacing
    if (paragraphWidth < 45) {
      recommendedWordSpacing -= 0.02;
    }

    recommendedWordSpacing = Math.max(-0.1, Math.min(0.2, recommendedWordSpacing));

    // ============================================
    // PARAGRAPH WIDTH recommendation
    // Based on: font size, line height, letter spacing
    // ============================================
    let recommendedParagraphWidth: number;

    // Base from font size
    if (fontSize <= 14) {
      recommendedParagraphWidth = 55;
    } else if (fontSize <= 18) {
      recommendedParagraphWidth = 65;
    } else if (fontSize <= 24) {
      recommendedParagraphWidth = 70;
    } else if (fontSize <= 36) {
      recommendedParagraphWidth = 50; // Headlines are shorter
    } else {
      recommendedParagraphWidth = 40; // Display text even shorter
    }

    // Adjust for line height - more line height allows wider paragraphs
    if (lineHeight > 1.6) {
      recommendedParagraphWidth += 5;
    } else if (lineHeight < 1.3) {
      recommendedParagraphWidth -= 10;
    }

    // Adjust for letter spacing
    if (letterSpacing > 0.02) {
      recommendedParagraphWidth -= 5; // Expanded text needs shorter lines
    }

    recommendedParagraphWidth = Math.max(30, Math.min(90, recommendedParagraphWidth));

    return {
      fontSize: recommendedFontSize,
      letterSpacing: Math.round(recommendedLetterSpacing * 100) / 100,
      wordSpacing: Math.round(recommendedWordSpacing * 100) / 100,
      lineHeight: Math.round(recommendedLineHeight * 100) / 100,
      paragraphWidth: Math.round(recommendedParagraphWidth),
    };
  }, [typography]);
}
