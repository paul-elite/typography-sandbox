'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FontOption } from '../../types/typography';

interface FontSelectorProps {
  fonts: FontOption[];
  selectedFont: string;
  onSelectFont: (font: string) => void;
  loadFont: (font: string) => void;
  loadingFont: string | null;
  isFontLoaded: (font: string) => boolean;
}

export function FontSelector({
  fonts,
  selectedFont,
  onSelectFont,
  loadFont,
  loadingFont,
  isFontLoaded,
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredFonts = fonts.filter(font =>
    font.family.toLowerCase().includes(search.toLowerCase())
  );

  const groupedFonts = filteredFonts.reduce((acc, font) => {
    const category = font.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(font);
    return acc;
  }, {} as Record<string, FontOption[]>);

  const handleSelect = useCallback((fontFamily: string) => {
    loadFont(fontFamily);
    onSelectFont(fontFamily);
    setIsOpen(false);
    setSearch('');
  }, [loadFont, onSelectFont]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryLabels: Record<string, string> = {
    'sans-serif': 'Sans Serif',
    'serif': 'Serif',
    'monospace': 'Monospace',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        Font Family
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-left hover:border-zinc-400 outline-none focus:outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6] transition-colors"
        style={{ outline: 'none' }}
      >
        <span
          className="text-zinc-900 truncate"
          style={{ fontFamily: isFontLoaded(selectedFont) ? `'${selectedFont}', sans-serif` : 'inherit' }}
        >
          {selectedFont}
        </span>
        <div className="flex items-center gap-2">
          {loadingFont === selectedFont && (
            <svg
              className="w-4 h-4 animate-spin text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-zinc-200">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:outline-none focus:border-transparent focus:shadow-[0_0_0_1px_#3b82f6]"
              style={{ outline: 'none' }}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(groupedFonts).map(([category, categoryFonts]) => (
              <div key={category}>
                <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 bg-zinc-50">
                  {categoryLabels[category] || category}
                </div>
                {categoryFonts.map((font) => (
                  <button
                    key={font.family}
                    onClick={() => handleSelect(font.family)}
                    onMouseEnter={() => loadFont(font.family)}
                    className={`w-full px-3 py-2 text-left hover:bg-zinc-100 transition-colors flex items-center justify-between ${selectedFont === font.family ? 'bg-blue-50 text-blue-700' : 'text-zinc-700'
                      }`}
                  >
                    <span
                      style={{
                        fontFamily: isFontLoaded(font.family)
                          ? `'${font.family}', ${font.category}`
                          : 'inherit',
                      }}
                    >
                      {font.family}
                    </span>
                    {loadingFont === font.family && (
                      <svg
                        className="w-4 h-4 animate-spin text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {!loadingFont && isFontLoaded(font.family) && selectedFont !== font.family && (
                      <span className="text-xs text-zinc-400">Loaded</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
            {filteredFonts.length === 0 && (
              <div className="px-3 py-4 text-sm text-zinc-500 text-center">
                No fonts found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
