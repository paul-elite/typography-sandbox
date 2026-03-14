'use client';

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  value: string; // hex color
  onChange: (hex: string) => void;
  defaultValue?: string;
}

// Convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function ColorPicker({ value, onChange, defaultValue }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hsl = useMemo(() => hexToHsl(value), [value]);

  const handleHueChange = useCallback((newHue: number) => {
    onChange(hslToHex(newHue, hsl.s, hsl.l));
  }, [hsl.s, hsl.l, onChange]);

  const handleSaturationChange = useCallback((newSat: number) => {
    onChange(hslToHex(hsl.h, newSat, hsl.l));
  }, [hsl.h, hsl.l, onChange]);

  const handleLightnessChange = useCallback((newLight: number) => {
    onChange(hslToHex(hsl.h, hsl.s, newLight));
  }, [hsl.h, hsl.s, onChange]);

  const isModified = defaultValue && value.toLowerCase() !== defaultValue.toLowerCase();

  return (
    <div className="relative space-y-3" ref={containerRef}>
      {/* Color Preview & Hex */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded border border-zinc-300 shadow-inner flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: value }}
          aria-label="Pick color"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value;
            // Allow typing just the hash or partial hex
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              // Update parent only if full valid 6-char hex
              if (val.length === 7) onChange(val);
            }
          }}
          className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs text-zinc-900 font-mono uppercase outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* HSL Sliders Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute left-0 top-full mt-2 w-full p-4 bg-white border border-zinc-200 rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.1)] z-50 space-y-4"
          >
            {/* Hue Slider */}
            <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs text-zinc-500">Hue</label>
          <span className="text-xs text-zinc-600 font-mono">{hsl.h}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={hsl.h}
          onChange={(e) => handleHueChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              hsl(0, 100%, 50%),
              hsl(60, 100%, 50%),
              hsl(120, 100%, 50%),
              hsl(180, 100%, 50%),
              hsl(240, 100%, 50%),
              hsl(300, 100%, 50%),
              hsl(360, 100%, 50%)
            )`,
          }}
        />
      </div>

      {/* Saturation Slider */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs text-zinc-500">Saturation</label>
          <span className="text-xs text-zinc-600 font-mono">{hsl.s}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={hsl.s}
          onChange={(e) => handleSaturationChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              hsl(${hsl.h}, 0%, ${hsl.l}%),
              hsl(${hsl.h}, 100%, ${hsl.l}%)
            )`,
          }}
        />
      </div>

      {/* Lightness Slider */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs text-zinc-500">Lightness</label>
          <span className="text-xs text-zinc-600 font-mono">{hsl.l}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={hsl.l}
          onChange={(e) => handleLightnessChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              hsl(${hsl.h}, ${hsl.s}%, 0%),
              hsl(${hsl.h}, ${hsl.s}%, 50%),
              hsl(${hsl.h}, ${hsl.s}%, 100%)
            )`,
          }}
        />
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
