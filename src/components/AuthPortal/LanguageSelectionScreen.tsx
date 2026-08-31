import React, { useState } from 'react';
import { 
  Languages, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../lib/translations';
import { audioService } from '../../lib/audioService';

interface LanguageSelectionScreenProps {
  patientName: string;
  initialLanguage: SupportedLanguage;
  onSelectLanguageAndContinue: (lang: SupportedLanguage) => void;
  onBackToLogin: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  patientName,
  initialLanguage = 'en',
  onSelectLanguageAndContinue,
  onBackToLogin,
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(initialLanguage);

  const handleSelectLang = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    audioService.playFeedbackSound('GENTLE_TAP');
  };

  const handleConfirmAndEnter = () => {
    audioService.playFeedbackSound('SUCCESS');
    onSelectLanguageAndContinue(selectedLang);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Warm Ambient Background Glows */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Pattern Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#78350f 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl shadow-[0_20px_50px_-15px_rgba(180,83,9,0.15)] overflow-hidden z-10 flex flex-col my-auto">
        
        {/* Top Glow Bar matching App Gradient */}
        <div className="h-2.5 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600" />

        {/* Top Navigation & App Name Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center p-1.5"
              style={{
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #059669 100%)',
              }}
            >
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 34C20 34 8 26.5 8 17.5C8 12.5 12 8.5 17 8.5C18.8 8.5 20 9.8 20 9.8C20 9.8 21.2 8.5 23 8.5C28 8.5 32 12.5 32 17.5C32 26.5 20 34 20 34Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="2" />
                <circle cx="20" cy="18.5" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="font-black text-lg text-stone-900 tracking-tight">
              MANAS AI
            </span>
          </div>

          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl">
            Language
          </span>
        </div>

        {/* Title Header */}
        <div className="px-6 pt-5 pb-3 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Choose Language
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
            {patientName ? `Personalized for ${patientName}` : 'Select your preferred language'}
          </p>
        </div>

        {/* 7 Regional Languages Grid (Clean 2-Column Grid - No Vertical Scroll) */}
        <div className="p-6 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLang(lang.code)}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-500 text-stone-900 ring-2 ring-amber-400/30 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : lang.code.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className={`font-black text-sm truncate ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                      {lang.nativeName}
                    </p>
                    <p className="text-xs text-stone-500 truncate font-medium">
                      {lang.name}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Action Button */}
        <div className="p-6 bg-stone-50 border-t border-stone-150">
          <button
            type="button"
            onClick={handleConfirmAndEnter}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-black text-base shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
          >
            <span>Open Companion</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
