'use client';

import { useCallback, useId, useMemo } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  onReset: () => void;
  defaultValue?: number;
  recommendedValue?: number;
  formatValue?: (value: number) => string;
  onApplyRecommended?: () => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  onReset,
  defaultValue,
  recommendedValue,
  formatValue,
  onApplyRecommended,
}: SliderProps) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const isDefault = defaultValue !== undefined && value === defaultValue;
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

  // Calculate percentages for slider gradient and recommended marker
  const percentage = ((value - min) / (max - min)) * 100;

  const recommendedPercentage = useMemo(() => {
    if (recommendedValue === undefined) return null;
    const clamped = Math.max(min, Math.min(max, recommendedValue));
    return ((clamped - min) / (max - min)) * 100;
  }, [recommendedValue, min, max]);

  const formattedRecommended = useMemo(() => {
    if (recommendedValue === undefined) return null;
    return formatValue ? formatValue(recommendedValue) : recommendedValue.toString();
  }, [recommendedValue, formatValue]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-zinc-300">
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
              className="w-16 px-2 py-1 text-xs text-right bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {unit && <span className="ml-1 text-xs text-zinc-500">{unit}</span>}
          </div>
          <button
            onClick={onReset}
            disabled={isDefault}
            className={`p-1 rounded transition-colors ${
              isDefault
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
            title="Reset to default"
            aria-label={`Reset ${label} to default`}
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
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider track with recommended marker */}
      <div className="relative">
        <input
          id={id}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer slider-track relative z-10"
          style={{
            background: `linear-gradient(to right, #a1a1aa 0%, #a1a1aa ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
          }}
        />

        {/* Recommended value marker */}
        {recommendedPercentage !== null && (
          <button
            onClick={onApplyRecommended}
            className="absolute top-1/2 -translate-y-1/2 z-20 group"
            style={{ left: `calc(${recommendedPercentage}% - 4px)` }}
            title={`Recommended: ${formattedRecommended}${unit}`}
            aria-label={`Apply recommended value: ${formattedRecommended}${unit}`}
          >
            {/* Diamond marker */}
            <div
              className={`w-2 h-2 rotate-45 transition-all ${
                isAtRecommended
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                  : 'bg-amber-400 group-hover:bg-amber-300 group-hover:scale-125'
              }`}
            />
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-amber-400">Rec:</span> {formattedRecommended}{unit}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
            </div>
          </button>
        )}
      </div>

      {/* Recommended value indicator below slider */}
      {recommendedValue !== undefined && !isAtRecommended && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-600">{min}{unit}</span>
          <button
            onClick={onApplyRecommended}
            className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>Recommended: {formattedRecommended}{unit}</span>
          </button>
          <span className="text-zinc-600">{max}{unit}</span>
        </div>
      )}

      <style jsx>{`
        .slider-track::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fafafa;
          cursor: pointer;
          border: 2px solid #a1a1aa;
          transition: all 0.15s ease;
        }
        .slider-track::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          border-color: #fafafa;
        }
        .slider-track::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fafafa;
          cursor: pointer;
          border: 2px solid #a1a1aa;
          transition: all 0.15s ease;
        }
        .slider-track::-moz-range-thumb:hover {
          transform: scale(1.1);
          border-color: #fafafa;
        }
      `}</style>
    </div>
  );
}
