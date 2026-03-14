'use client';

import { useState, useCallback, useEffect } from 'react';
import { TypographyState, ExportFormat } from '../../types/typography';
import { exportTypography, copyToClipboard, downloadFile } from '../../utils/export';

interface ExportModalProps {
  typography: TypographyState;
  isOpen: boolean;
  onClose: () => void;
}

const exportFormats: Array<{ value: ExportFormat; label: string; icon: string; extension: string; mimeType: string }> = [
  { value: 'css', label: 'CSS', icon: '🎨', extension: 'css', mimeType: 'text/css' },
  { value: 'tailwind', label: 'Tailwind', icon: '💨', extension: 'js', mimeType: 'text/javascript' },
  { value: 'json', label: 'JSON Tokens', icon: '📦', extension: 'json', mimeType: 'application/json' },
];

export function ExportModal({ typography, isOpen, onClose }: ExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const exportedCode = exportTypography(typography, activeFormat);

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Export Typography</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format Selector */}
          <div className="flex gap-2">
            {exportFormats.map((format) => (
              <button
                key={format.value}
                onClick={() => setActiveFormat(format.value)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-lg transition-colors ${
                  activeFormat === format.value
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
            <pre className="p-4 bg-zinc-900 rounded-xl text-sm text-zinc-300 overflow-auto max-h-72 font-mono">
              <code>{exportedCode}</code>
            </pre>

            {/* Copy/Download Actions */}
            <div className="absolute top-3 right-3 flex gap-1">
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-colors ${
                  copied
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
                className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 rounded-lg transition-colors"
                title="Download file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hints */}
          <p className="text-xs text-zinc-500">
            {activeFormat === 'css' && 'Copy the CSS class or use the custom properties (CSS variables) for flexibility.'}
            {activeFormat === 'tailwind' && 'Add this configuration to your tailwind.config.js file to use custom typography classes.'}
            {activeFormat === 'json' && 'Design tokens compatible with Style Dictionary and similar tools.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
}
