'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import {
  TypographyState,
  ViewportPreset,
  VIEWPORT_PRESETS,
  TypographyGuides,
  TextLayer,
  LayerTypography,
  LayoutSettings,
  LayerContent,
} from '../../types/typography';

interface TypographyCanvasProps {
  layerTypography: LayerTypography;
  selectedLayer: TextLayer | null;
  onSelectLayer: (layer: TextLayer | null) => void;
  layout: LayoutSettings;
  onLayoutChange: <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => void;
  layerContent: LayerContent;
  viewport: ViewportPreset;
  guides: TypographyGuides;
  isFontLoaded: (font: string) => boolean;
}

const LAYER_LABELS: Record<TextLayer, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  caption: 'Caption',
};

function GapHandle({
  value,
  onChange,
  minHeight = 0,
}: {
  value: number;
  onChange: (value: number) => void;
  minHeight?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ y: number; startValue: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragStartRef.current = { y: e.clientY, startValue: value };
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaY = dragStartRef.current.y - moveEvent.clientY;
      const newValue = Math.max(0, Math.min(128, dragStartRef.current.startValue + deltaY));
      onChange(Math.round(newValue / 2) * 2); // Snap to 2px increments
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [value, onChange]);

  const displayHeight = Math.max(minHeight, value);
  const isActive = isHovered || isDragging;

  return (
    <div
      className={`relative cursor-ns-resize select-none ${isDragging ? 'z-50' : ''}`}
      style={{ height: `${displayHeight}px`, minHeight: `${minHeight}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isDragging && setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hover/drag indicator */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-100 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`flex-1 h-px mx-2 ${isDragging ? 'bg-blue-500' : 'bg-blue-400'}`} />
        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-white text-[11px] font-medium rounded-full shadow-md transition-colors ${
          isDragging ? 'bg-blue-600' : 'bg-blue-500'
        }`}>
          <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5-5 5 5M7 14l5 5 5-5" />
          </svg>
          {value}px
        </div>
        <div className={`flex-1 h-px mx-2 ${isDragging ? 'bg-blue-500' : 'bg-blue-400'}`} />
      </div>
    </div>
  );
}

function LayerText({
  layer,
  typography,
  content,
  isSelected,
  onSelect,
  isFontLoaded,
}: {
  layer: TextLayer;
  typography: TypographyState;
  content: string;
  isSelected: boolean;
  onSelect: () => void;
  isFontLoaded: boolean;
}) {
  const textStyle = useMemo(() => ({
    fontFamily: isFontLoaded ? `'${typography.fontFamily}', sans-serif` : 'system-ui, sans-serif',
    fontSize: `${typography.fontSize}px`,
    fontWeight: typography.fontWeight,
    letterSpacing: `${typography.letterSpacing}em`,
    wordSpacing: `${typography.wordSpacing}em`,
    lineHeight: typography.lineHeight,
    maxWidth: `${typography.paragraphWidth}ch`,
    textAlign: typography.textAlign as React.CSSProperties['textAlign'],
    color: typography.textColor,
  }), [typography, isFontLoaded]);

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-150 rounded-md ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50/50'
          : 'hover:ring-1 hover:ring-zinc-300 hover:bg-zinc-50/50'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{ padding: '8px' }}
    >
      {/* Layer label */}
      <div
        className={`absolute -top-2.5 left-2 px-2 py-0.5 text-[10px] font-medium rounded transition-opacity ${
          isSelected
            ? 'bg-blue-500 text-white opacity-100'
            : 'bg-zinc-200 text-zinc-600 opacity-0 group-hover:opacity-100'
        }`}
      >
        {LAYER_LABELS[layer]}
      </div>

      <div
        className="whitespace-pre-wrap break-words transition-all duration-150"
        style={textStyle}
      >
        {content}
      </div>
    </div>
  );
}

export function TypographyCanvas({
  layerTypography,
  selectedLayer,
  onSelectLayer,
  layout,
  onLayoutChange,
  layerContent,
  viewport,
  guides,
  isFontLoaded,
}: TypographyCanvasProps) {
  const viewportWidth = VIEWPORT_PRESETS[viewport].width;

  // Use the selected layer's typography for guide calculations, default to paragraph
  const guideTypography = selectedLayer ? layerTypography[selectedLayer] : layerTypography.paragraph;

  const combinedGuideStyle = useMemo(() => {
    const styles: React.CSSProperties = {};
    const backgrounds: string[] = [];
    const sizes: string[] = [];

    if (guides.baselineGrid) {
      const lineHeightPx = guideTypography.fontSize * guideTypography.lineHeight;
      const hexColor = layout.strokeColor || '#FBD152';
      
      // Convert hex to rgba to apply 50% opacity
      let r = 251, g = 209, b = 82; // Default #FBD152
      const hexMatch = hexColor.match(/^#?([A-Fa-f\d]{2})([A-Fa-f\d]{2})([A-Fa-f\d]{2})$/);
      if (hexMatch) {
         r = parseInt(hexMatch[1], 16);
         g = parseInt(hexMatch[2], 16);
         b = parseInt(hexMatch[3], 16);
      }
      const gridColorAlpha = `rgba(${r}, ${g}, ${b}, 0.5)`;

      backgrounds.push(`linear-gradient(to bottom, transparent ${lineHeightPx - 1}px, ${gridColorAlpha} ${lineHeightPx - 1}px, ${gridColorAlpha} ${lineHeightPx}px)`);
      sizes.push(`100% ${lineHeightPx}px`);
    }

    if (guides.lineBox) {
      const lineHeightPx = guideTypography.fontSize * guideTypography.lineHeight;
      backgrounds.push(`repeating-linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 0px, rgba(168, 85, 247, 0.1) ${lineHeightPx}px, transparent ${lineHeightPx}px, transparent ${lineHeightPx * 2}px)`);
      sizes.push(`100% ${lineHeightPx * 2}px`);
    }

    if (guides.xHeight) {
      const xHeight = guideTypography.fontSize * 0.5;
      const lineHeightPx = guideTypography.fontSize * guideTypography.lineHeight;
      const topOffset = (lineHeightPx - guideTypography.fontSize) / 2 + guideTypography.fontSize * 0.25;
      backgrounds.push(`repeating-linear-gradient(to bottom, transparent 0px, transparent ${topOffset}px, rgba(34, 197, 94, 0.2) ${topOffset}px, rgba(34, 197, 94, 0.2) ${topOffset + xHeight}px, transparent ${topOffset + xHeight}px, transparent ${lineHeightPx}px)`);
      sizes.push(`100% ${lineHeightPx}px`);
    }

    if (backgrounds.length > 0) {
      styles.backgroundImage = backgrounds.join(', ');
      styles.backgroundSize = sizes.join(', ');
    }

    return styles;
  }, [guides, guideTypography.fontSize, guideTypography.lineHeight]);

  const hasGuides = guides.baselineGrid || guides.lineBox || guides.xHeight;

  // Alignment styles for cross-axis
  const alignmentStyle = useMemo(() => {
    switch (layout.alignment) {
      case 'center':
        return { alignItems: 'center' };
      case 'stretch':
        return { alignItems: 'stretch' };
      default:
        return { alignItems: 'flex-start' };
    }
  }, [layout.alignment]);

  const handleCanvasClick = () => {
    onSelectLayer(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Guide Legend */}
      {hasGuides && (
        <div className="flex items-center gap-4 mb-3 px-4 flex-shrink-0">
          {guides.baselineGrid && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded" />
              <span className="text-xs text-zinc-500">Baseline</span>
            </div>
          )}
          {guides.lineBox && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-purple-500/20 rounded-sm" />
              <span className="text-xs text-zinc-500">Line Box</span>
            </div>
          )}
          {guides.xHeight && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 bg-green-500/20 rounded-sm" />
              <span className="text-xs text-zinc-500">X-Height</span>
            </div>
          )}
        </div>
      )}

      {/* Canvas Container */}
      <div
        className="flex-1 flex items-start justify-center p-6 rounded-xl overflow-auto min-h-0 cursor-default"
        onClick={handleCanvasClick}
      >
        <div
          className="rounded-lg transition-all duration-300 overflow-hidden border shadow-[4px_4px_0px_rgba(0,0,0,0.08)]"
          style={{ 
            width: `min(100%, ${viewportWidth}px)`,
            borderColor: layout.strokeColor || '#FBD152'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Viewport Indicator */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b"
            style={{ 
              backgroundColor: layout.strokeColor || '#FBD152',
              borderColor: layout.strokeColor || '#FBD152'
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>

          {/* Text Content - Three Layers */}
          <div
            className="min-h-[200px] relative flex flex-col"
            style={{
              backgroundColor: layout.backgroundColor,
              padding: `${layout.padding}px`,
              ...(hasGuides ? combinedGuideStyle : {}),
              ...alignmentStyle,
            }}
            onClick={handleCanvasClick}
          >
            {/* Heading Layer */}
            <LayerText
              layer="heading"
              typography={layerTypography.heading}
              content={layerContent.heading}
              isSelected={selectedLayer === 'heading'}
              onSelect={() => onSelectLayer('heading')}
              isFontLoaded={isFontLoaded(layerTypography.heading.fontFamily)}
            />

            {/* Gap between heading and paragraph */}
            <GapHandle
              value={layout.headingParagraphGap}
              onChange={(value) => onLayoutChange('headingParagraphGap', value)}
              minHeight={16}
            />

            {/* Paragraph Layer */}
            <LayerText
              layer="paragraph"
              typography={layerTypography.paragraph}
              content={layerContent.paragraph}
              isSelected={selectedLayer === 'paragraph'}
              onSelect={() => onSelectLayer('paragraph')}
              isFontLoaded={isFontLoaded(layerTypography.paragraph.fontFamily)}
            />

            {/* Gap between paragraph and caption */}
            <GapHandle
              value={layout.paragraphCaptionGap}
              onChange={(value) => onLayoutChange('paragraphCaptionGap', value)}
              minHeight={16}
            />

            {/* Caption Layer */}
            <LayerText
              layer="caption"
              typography={layerTypography.caption}
              content={layerContent.caption}
              isSelected={selectedLayer === 'caption'}
              onSelect={() => onSelectLayer('caption')}
              isFontLoaded={isFontLoaded(layerTypography.caption.fontFamily)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
