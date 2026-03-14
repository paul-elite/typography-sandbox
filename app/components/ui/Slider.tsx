'use client';

import { useCallback, useId } from 'react';

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
  formatValue?: (value: number) => string;
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
  formatValue,
}: SliderProps) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const isDefault = defaultValue !== undefined && value === defaultValue;

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

  // Calculate percentage for slider gradient
  const percentage = ((value - min) / (max - min)) * 100;

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
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer slider-track"
        style={{
          background: `linear-gradient(to right, #a1a1aa 0%, #a1a1aa ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
        }}
      />
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
