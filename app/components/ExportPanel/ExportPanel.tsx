'use client';

import { useState, useCallback } from 'react';
import { LayerTypography, ExportFormat } from '../../types/typography';
import { exportTypography, copyToClipboard, downloadFile } from '../../utils/export';

interface ExportPanelProps {
  layerTypography: LayerTypography;
}

const exportFormats: Array<{ value: ExportFormat; label: string; icon: string; extension: string; mimeType: string }> = [
  { value: 'css', label: 'CSS', icon: '🎨', extension: 'css', mimeType: 'text/css' },
  { value: 'tailwind', label: 'Tailwind', icon: '💨', extension: 'js', mimeType: 'text/javascript' },
  { value: 'json', label: 'JSON Tokens', icon: '📦', extension: 'json', mimeType: 'application/json' },
];

export function ExportPanel({ layerTypography }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const exportedCode = exportTypography(layerTypography, activeFormat);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(exportedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [exportedCode]);

  const handleDownload = useCallback(() => {
    const format = exportFormats.find(f => f.value === activeFormat);
    if (format) {
      downloadFile(
        exportedCode,
        `typography.${format.extension}`,
        format.mimeType
      );
    }
  }, [exportedCode, activeFormat]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0px_0px_0px_0.5px_rgba(0,0,0,0.1)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors"
      >
        <h2 className="text-sm font-semibold text-zinc-800">
          Export Typography
        </h2>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-zinc-200 pt-4">
          {/* Format Selector */}
          <div className="flex gap-1.5">
            {exportFormats.map((format) => (
              <button
                key={format.value}
                onClick={() => setActiveFormat(format.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md transition-colors ${activeFormat === format.value
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                  }`}
              >
                <span>{format.icon}</span>
                <span>{format.label}</span>
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="relative">
            <pre className="p-4 bg-zinc-900 rounded-lg text-xs text-zinc-300 overflow-auto max-h-64 font-mono">
              <code>{exportedCode}</code>
            </pre>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded transition-colors ${copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                  }`}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 rounded transition-colors"
                title="Download file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hints */}
          <div className="text-xs text-zinc-500">
            {activeFormat === 'css' && (
              <p>Copy the CSS classes or use the custom properties (CSS variables) for flexibility. Includes all three layers.</p>
            )}
            {activeFormat === 'tailwind' && (
              <p>Add this configuration to your tailwind.config.js file to use custom typography classes for all layers.</p>
            )}
            {activeFormat === 'json' && (
              <p>Design tokens compatible with Style Dictionary and similar tools. Contains all layer typography settings.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
