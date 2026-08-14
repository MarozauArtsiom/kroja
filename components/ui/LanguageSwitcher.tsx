// components/ui/LanguageSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { SUPPORTED_LOCALES, LOCALE_INFOS } from '@/content/i18n';
import FlagIcon from './FlagIcon';
import type { SupportedLocale } from '@/types/i18n';

export default function LanguageSwitcher() {
  const { locale, switchLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentInfo = LOCALE_INFOS[locale] || LOCALE_INFOS.en;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 items-center gap-2 rounded-sm border border-line bg-paper px-2.5 text-xs font-medium text-ink transition-colors hover:border-ink focus-visible:outline-accent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current language: ${currentInfo.nativeName}. Click to switch.`}
      >
        <FlagIcon locale={locale} className="h-3.5 w-5" />
        <span className="uppercase tracking-wider">{locale}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 z-50 mt-1 w-44 rounded-sm border border-line bg-paper p-1 shadow-lg ring-1 ring-ink/5"
        >
          {SUPPORTED_LOCALES.map((l: SupportedLocale) => {
            const info = LOCALE_INFOS[l];
            const isSelected = l === locale;

            return (
              <button
                key={l}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  switchLocale(l);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-paper-2 font-medium text-ink'
                    : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FlagIcon locale={l} className="h-3.5 w-5" />
                  <span>{info.nativeName}</span>
                </div>
                {isSelected && (
                  <span className="text-accent" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
