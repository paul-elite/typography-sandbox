'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import {
  TypographyState,
  ViewportPreset,
  VIEWPORT_PRESETS,
  TypographyGuides,
  TextLayer,
  LayerTypography,
  LayoutSettings,
  LayerContent,
  TextHolderInstance,
} from '../../types/typography';

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
  onChange,
  isFontLoaded,
}: {
  layer: TextLayer;
  typography: TypographyState;
  content: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange?: <K extends keyof TypographyState>(key: K, value: TypographyState[K]) => void;
  isFontLoaded: boolean;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; startWidthCH: number } | null>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStartRef.current = { x: e.clientX, startWidthCH: typography.paragraphWidth };
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current || !onChange) return;
      
      const deltaX = moveEvent.clientX - resizeStartRef.current.x;
      const chPx = typography.fontSize * 0.5;
      const deltaCh = deltaX / chPx;
      
      let newWidth = Math.round(resizeStartRef.current.startWidthCH + deltaCh);
      newWidth = Math.max(10, Math.min(200, newWidth));
      
      onChange('paragraphWidth', newWidth);
    };

    const handleMouseUp = () => {
      resizeStartRef.current = null;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [typography.paragraphWidth, typography.fontSize, onChange]);

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
        className={`whitespace-pre-wrap break-words relative ${!isResizing ? 'transition-all duration-150' : ''}`}
        style={textStyle}
      >
        {content}
        {isSelected && onChange && (
          <div
            className="absolute -right-3 top-0 bottom-0 w-6 cursor-col-resize flex justify-center items-center group/resizer z-10"
            onMouseDown={handleResizeStart}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-1 h-8 rounded-full transition-colors ${isResizing ? 'bg-blue-600' : 'bg-transparent group-hover/resizer:bg-blue-400'}`} />
            
            <div className={`absolute top-1/2 -translate-y-1/2 left-full ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded transition-opacity whitespace-nowrap pointer-events-none ${isResizing ? 'opacity-100' : 'opacity-0'}`}>
              {typography.paragraphWidth}ch
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InstanceRenderer({
  instance,
  isSelected,
  selectedLayer,
  onSelect,
  onRemove,
  onSelectLayer,
  onTypographyChange,
  onLayoutChange,
  viewportWidth,
  onViewportWidthChange,
  guides,
  isFontLoaded
}: any) {
  const dragControls = useDragControls();
  const [isContainerResizing, setIsContainerResizing] = useState(false);
  const containerResizeStartRef = useRef<{ x: number; startWidthPx: number } | null>(null);

  const handleContainerResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    containerResizeStartRef.current = { x: e.clientX, startWidthPx: viewportWidth };
    setIsContainerResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerResizeStartRef.current) return;
      const deltaX = moveEvent.clientX - containerResizeStartRef.current.x;
      let newWidth = Math.round(containerResizeStartRef.current.startWidthPx + deltaX * 2);
      newWidth = Math.max(320, Math.min(2400, newWidth));
      onViewportWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      containerResizeStartRef.current = null;
      setIsContainerResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [viewportWidth, onViewportWidthChange]);

  const guideTypography = selectedLayer && isSelected ? instance.layerTypography[selectedLayer] : instance.layerTypography.paragraph;

  const combinedGuideStyle = useMemo(() => {
    const styles: React.CSSProperties = {};
    const backgrounds: string[] = [];
    const sizes: string[] = [];

    if (guides.baselineGrid) {
      const lineHeightPx = guideTypography.fontSize * guideTypography.lineHeight;
      const hexColor = instance.layout.strokeColor || '#FBD152';
      
      let r = 251, g = 209, b = 82;
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
  }, [guides, guideTypography.fontSize, guideTypography.lineHeight, instance.layout.strokeColor]);

  const hasGuides = guides.baselineGrid || guides.lineBox || guides.xHeight;

  const alignmentStyle = useMemo(() => {
    switch (instance.layout.alignment) {
      case 'center':
        return { alignItems: 'center' };
      case 'stretch':
        return { alignItems: 'stretch' };
      default:
        return { alignItems: 'flex-start' };
    }
  }, [instance.layout.alignment]);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ x: instance.x, y: instance.y }}
      className={`absolute shadow-[4px_4px_0px_rgba(0,0,0,0.08)] bg-white rounded-lg border transition-shadow duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 z-40' : 'hover:ring-1 hover:ring-blue-300 z-10'
      }`}
      style={{
        width: viewportWidth,
        borderColor: instance.layout.strokeColor || '#FBD152'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Top Bar / Drag Handle */}
      <div 
        className="h-8 bg-zinc-50 border-b flex items-center justify-between px-2 cursor-grab active:cursor-grabbing rounded-t-lg select-none"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }} 
          className="p-1 hover:bg-red-100 rounded text-zinc-500 hover:text-red-500 transition-colors pointer-events-auto"
          title="Close instance"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 flex justify-center opacity-30">
          <div className="w-12 h-1.5 bg-zinc-400 rounded-full" />
        </div>
        <div className="w-6" /> {/* Placeholder for balance */}
      </div>

      {/* Viewport Indicator */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ 
          backgroundColor: instance.layout.strokeColor || '#FBD152',
          borderColor: instance.layout.strokeColor || '#FBD152'
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
      </div>

      <div className="relative">
        {/* Text Content */}
        <div
          className="min-h-[200px] flex flex-col"
          style={{
            backgroundColor: instance.layout.backgroundColor,
            padding: `${instance.layout.padding}px`,
            ...(hasGuides ? combinedGuideStyle : {}),
            ...alignmentStyle,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
            onSelectLayer(null);
          }}
        >
          {/* Heading */}
          <LayerText
            layer="heading"
            typography={instance.layerTypography.heading}
            content={instance.layerContent.heading}
            isSelected={isSelected && selectedLayer === 'heading'}
            onSelect={() => { onSelect(); onSelectLayer('heading'); }}
            onChange={isSelected && selectedLayer === 'heading' ? onTypographyChange : undefined}
            isFontLoaded={isFontLoaded(instance.layerTypography.heading.fontFamily)}
          />

          <GapHandle
            value={instance.layout.headingParagraphGap}
            onChange={(value) => isSelected && onLayoutChange('headingParagraphGap', value)}
            minHeight={16}
          />

          {/* Paragraph */}
          <LayerText
            layer="paragraph"
            typography={instance.layerTypography.paragraph}
            content={instance.layerContent.paragraph}
            isSelected={isSelected && selectedLayer === 'paragraph'}
            onSelect={() => { onSelect(); onSelectLayer('paragraph'); }}
            onChange={isSelected && selectedLayer === 'paragraph' ? onTypographyChange : undefined}
            isFontLoaded={isFontLoaded(instance.layerTypography.paragraph.fontFamily)}
          />

          <GapHandle
            value={instance.layout.paragraphCaptionGap}
            onChange={(value) => isSelected && onLayoutChange('paragraphCaptionGap', value)}
            minHeight={16}
          />

          {/* Caption */}
          <LayerText
            layer="caption"
            typography={instance.layerTypography.caption}
            content={instance.layerContent.caption}
            isSelected={isSelected && selectedLayer === 'caption'}
            onSelect={() => { onSelect(); onSelectLayer('caption'); }}
            onChange={isSelected && selectedLayer === 'caption' ? onTypographyChange : undefined}
            isFontLoaded={isFontLoaded(instance.layerTypography.caption.fontFamily)}
          />
        </div>

        {/* Container Drag Handle (Resizer) */}
        {isSelected && (
          <div
            className="absolute -right-4 top-0 bottom-0 w-8 cursor-col-resize flex flex-col justify-center items-center group/container md:-right-6"
            onMouseDown={handleContainerResizeStart}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-1.5 h-16 rounded-full transition-colors ${isContainerResizing ? 'bg-amber-600' : 'bg-transparent group-hover/container:bg-amber-400'}`} />
            <div className={`absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-1 bg-amber-600 text-white text-xs font-mono rounded shadow-lg transition-opacity whitespace-nowrap pointer-events-none ${isContainerResizing ? 'opacity-100' : 'opacity-0'}`}>
              {viewportWidth}px
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface TypographyCanvasProps {
  instances: TextHolderInstance[];
  selectedInstanceId: string | null;
  onSelectInstance: (id: string | null) => void;
  onAddInstance: (x: number, y: number) => void;
  onRemoveInstance: (id: string) => void;
  onUpdateInstancePosition: (id: string, x: number, y: number) => void;
  selectedLayer: TextLayer | null;
  onSelectLayer: (layer: TextLayer | null) => void;
  onTypographyChange: <K extends keyof TypographyState>(key: K, value: TypographyState[K]) => void;
  onLayoutChange: <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => void;
  viewport: ViewportPreset;
  customViewportWidth: number;
  onCustomViewportWidthChange: (width: number) => void;
  guides: TypographyGuides;
  isFontLoaded: (font: string) => boolean;
}

export function TypographyCanvas({
  instances,
  selectedInstanceId,
  onSelectInstance,
  onAddInstance,
  onRemoveInstance,
  onUpdateInstancePosition,
  selectedLayer,
  onSelectLayer,
  onTypographyChange,
  onLayoutChange,
  viewport,
  customViewportWidth,
  onCustomViewportWidthChange,
  guides,
  isFontLoaded,
}: TypographyCanvasProps) {
  const viewportWidth = viewport === 'custom' ? customViewportWidth : VIEWPORT_PRESETS[viewport as keyof typeof VIEWPORT_PRESETS]?.width || 1200;

  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectInstance(null);
      onSelectLayer(null);
      
      if (!popupPosition && instances.length < 5) {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setPopupPosition(null);
      }
    } else {
       setPopupPosition(null);
    }
  };

  const hasGuides = guides.baselineGrid || guides.lineBox || guides.xHeight;

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
        className="flex-1 overflow-auto rounded-xl relative cursor-default outline-none shadow-inner bg-[rgba(0,0,0,0.02)] border border-black/5"
        onClick={handleCanvasClick}
      >
        {instances.map((instance) => (
          <InstanceRenderer
            key={instance.id}
            instance={instance}
            isSelected={instance.id === selectedInstanceId}
            selectedLayer={selectedLayer}
            onSelect={() => onSelectInstance(instance.id)}
            onRemove={() => onRemoveInstance(instance.id)}
            onSelectLayer={onSelectLayer}
            onTypographyChange={onTypographyChange}
            onLayoutChange={onLayoutChange}
            viewportWidth={viewportWidth}
            onViewportWidthChange={onCustomViewportWidthChange}
            guides={guides}
            isFontLoaded={isFontLoaded}
          />
        ))}

        {popupPosition && instances.length < 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute shadow-lg bg-zinc-900 rounded-full p-2 z-50 flex items-center justify-center cursor-pointer hover:bg-zinc-800 border border-zinc-700 hover:scale-105 transition-all outline-none"
            style={{ left: popupPosition.x, top: popupPosition.y, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onAddInstance(popupPosition.x, popupPosition.y);
              setPopupPosition(null);
            }}
            title="Create new text holder instance"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
