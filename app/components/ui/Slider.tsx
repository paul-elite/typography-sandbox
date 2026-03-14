'use client';

import { useCallback, useId, useMemo, useState } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  defaultValue?: number;
  recommendedValue?: number;
  formatValue?: (value: number) => string;
  onApplyRecommended?: () => void;
  onSlideStart?: () => void;
  onSlideEnd?: () => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  defaultValue,
  recommendedValue,
  formatValue,
  onApplyRecommended,
  onSlideStart,
  onSlideEnd,
}: SliderProps) {
  const id = useId();
  const [isSliding, setIsSliding] = useState(false);
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const isAtRecommended = recommendedValue !== undefined && Math.abs(value - recommendedValue) < step;

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  }, [onChange, min, max]);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      newValue = defaultValue ?? min;
    }
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  }, [onChange, min, max, defaultValue]);

  const handlePointerDown = useCallback(() => {
    setIsSliding(true);
    onSlideStart?.();
  }, [onSlideStart]);

  const handlePointerUp = useCallback(() => {
    setIsSliding(false);
    onSlideEnd?.();
  }, [onSlideEnd]);

  // Calculate percentages for slider gradient and recommended marker
  const percentage = ((value - min) / (max - min)) * 100;

  const recommendedPercentage = useMemo(() => {
    if (recommendedValue === undefined) return null;
    const clamped = Math.max(min, Math.min(max, recommendedValue));
    return ((clamped - min) / (max - min)) * 100;
  }, [recommendedValue, min, max]);

  // Colors for active range
  const activeColor = isSliding ? '#3b82f6' : '#71717a';
  const trackBgColor = '#e4e4e7';

  // Hide ghost thumb when sliding (it follows the main thumb)
  const showGhostThumb = recommendedPercentage !== null && !isAtRecommended && !isSliding;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <input
              type="number"
              value={displayValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className="w-16 px-2 py-1 text-xs text-right bg-white border border-zinc-300 rounded text-zinc-800 outline-none focus:outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ outline: 'none' }}
            />
            {unit && <span className="ml-1 text-xs text-zinc-500">{unit}</span>}
          </div>
          <button
            onClick={onApplyRecommended}
            disabled={isAtRecommended || recommendedValue === undefined || isSliding}
            className={`p-1 rounded transition-colors ${isAtRecommended || recommendedValue === undefined || isSliding
              ? 'text-zinc-300 cursor-not-allowed'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
              }`}
            title="Snap to recommended"
            aria-label={`Snap ${label} to recommended value`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider track with ghost recommended thumb */}
      <div className="relative h-4 flex items-center">
        {/* Ghost thumb for recommended value */}
        {showGhostThumb && (
          <button
            onClick={onApplyRecommended}
            className="absolute top-1/2 -translate-y-1/2 z-[5] cursor-pointer group transition-all duration-200"
            style={{ left: `calc(${recommendedPercentage}% - 7px)` }}
            title={`Click to apply recommended value`}
            aria-label={`Apply recommended value`}
          >
            <div className="w-[14px] h-[14px] rounded-full bg-zinc-300 border-2 border-zinc-400 transition-all group-hover:bg-zinc-400 group-hover:border-zinc-500 group-hover:scale-110" />
          </button>
        )}

        <input
          id={id}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer relative z-10 transition-all duration-150 ${isSliding ? 'slider-track-active' : 'slider-track'
            }`}
          style={{
            background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${percentage}%, ${trackBgColor} ${percentage}%, ${trackBgColor} 100%)`,
          }}
        />
      </div>

      <style jsx>{`
        .slider-track::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #71717a;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.15s ease;
          position: relative;
          z-index: 20;
        }
        .slider-track::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          border-color: #52525b;
        }
        .slider-track::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #71717a;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.15s ease;
          position: relative;
          z-index: 20;
        }
        .slider-track::-moz-range-thumb:hover {
          transform: scale(1.1);
          border-color: #52525b;
        }
        .slider-track-active::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
          transition: all 0.15s ease;
          position: relative;
          z-index: 20;
        }
        .slider-track-active::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
          transition: all 0.15s ease;
          position: relative;
          z-index: 20;
        }
      `}</style>
    </div>
  );
}
