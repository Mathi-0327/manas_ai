import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Brain, Heart, Shield, Activity } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface OpeningSplashScreenProps {
  onComplete: () => void;
}

const INTRO_SLIDES = [
  {
    icon: Brain,
    title: 'Cognitive Health & Memory Care',
    description: 'Personalized memory games, cultural activities & daily brain workouts',
  },
  {
    icon: Heart,
    title: 'Gentle Voice Companion',
    description: 'Conversational support in your native North East languages & dialects',
  },
  {
    icon: Activity,
    title: 'Offline & Caregiver Connected',
    description: '100% private offline functionality with caregiver telemetry & insights',
  },
];

export const OpeningSplashScreen: React.FC<OpeningSplashScreenProps> = ({ onComplete }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Play warm gentle entry chime
    audioService.playFeedbackSound('GENTLE_TAP');

    // Cycle through slides every 1.2s
    const slideInterval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % INTRO_SLIDES.length);
    }, 1200);

    // Progress bar towards auto-completion (3.2s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(slideInterval);
          handleFinish();
          return 100;
        }
        return prev + 3;
      });
    }, 85);

    return () => {
      clearInterval(slideInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  const currentSlide = INTRO_SLIDES[slideIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div
      id="manas-opening-splash"
      className={`fixed inset-0 z-50 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950 text-white flex flex-col justify-between items-center p-6 select-none transition-opacity duration-400 ${
        isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>North East Cognitive Care Companion</span>
        </div>

        <button
          onClick={handleFinish}
          className="text-xs font-bold text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full bg-stone-850 hover:bg-stone-800 border border-stone-700/60 cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centerpiece Logo & Intro Feature Cycling */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-10 space-y-6 max-w-md">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-2xl scale-125 animate-pulse" />
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center p-4 shadow-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #059669 100%)',
              boxShadow: '0 12px 32px -4px rgba(217, 119, 6, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
            }}
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <path d="M20 34C20 34 8 26.5 8 17.5C8 12.5 12 8.5 17 8.5C18.8 8.5 20 9.8 20 9.8C20 9.8 21.2 8.5 23 8.5C28 8.5 32 12.5 32 17.5C32 26.5 20 34 20 34Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 19C13.5 15.4 16.4 12.5 20 12.5C23.6 12.5 26.5 15.4 26.5 19C26.5 23 20 28.5 20 28.5C20 28.5 13.5 23 13.5 19Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="18.5" r="2.5" fill="white" />
            </svg>
          </div>
        </div>

        {/* Brand Name Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MANAS AI
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-bold uppercase tracking-wider mt-1">
            Cognitive Health & Memory Companion
          </p>
        </div>

        {/* Dynamic Intro Feature Slide */}
        <div className="min-h-[90px] flex flex-col items-center justify-center space-y-2 animate-fade-in key={slideIndex}">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-amber-300 text-xs font-extrabold">
            <IconComponent className="w-4 h-4 text-amber-400" />
            <span>{currentSlide.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 font-medium px-4 leading-relaxed">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Direct Action */}
      <div className="w-full max-w-sm flex flex-col items-center space-y-4 z-10 pb-6">
        <button
          onClick={handleFinish}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
        >
          <span>Continue to Patient Login</span>
          <ArrowRight className="w-4 h-4 text-stone-950" />
        </button>

        {/* Auto progress indicator */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-stone-500 font-semibold px-1">
            <span>Initializing Offline Modules</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
