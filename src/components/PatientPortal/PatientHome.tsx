import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  Brain, 
  Eye, 
  Layers, 
  Heart, 
  Camera, 
  Bell, 
  Music, 
  MessageCircle, 
  Play, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Radio,
  LifeBuoy,
  CalendarCheck,
  MessageSquare,
  FolderTree,
  BookOpenCheck
} from 'lucide-react';
import { 
  PatientProfile, 
  CaregiverInstruction, 
  SupportedLanguage, 
  GameCategory 
} from '../../types';
import { t } from '../../lib/translations';
import { audioService } from '../../lib/audioService';

interface PatientHomeProps {
  patient: PatientProfile;
  instructions: CaregiverInstruction[];
  language: SupportedLanguage;
  onOpenVoice: () => void;
  onStartGame: (category: GameCategory) => void;
  onOpenMemories: () => void;
  onOpenReminders: () => void;
  onOpenRelaxation: () => void;
  onOpenRadio: () => void;
  onOpenFamily: () => void;
  onOpenBaseline: () => void;
  onOpenSafeHaven: () => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({
  patient,
  instructions,
  language,
  onOpenVoice,
  onStartGame,
  onOpenMemories,
  onOpenReminders,
  onOpenRelaxation,
  onOpenRadio,
  onOpenFamily,
  onOpenBaseline,
  onOpenSafeHaven,
}) => {
  const activeInstruction = instructions.find((i) => i.appliedStatus === 'ACTIVE');
  const preferredTheme = activeInstruction?.structuredRule?.preferredTheme || 'Assam Tea Gardens & Folk Music';

  const handleQuickTap = (cb: () => void) => {
    audioService.playFeedbackSound('GENTLE_TAP');
    cb();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Warm Greeting & Voice Assistant Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Namaskar • Good Morning</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('greeting.morning', language)}, {patient.name.split(' ')[0]}!
            </h1>
            <p className="text-amber-100 text-sm sm:text-base font-medium mt-1">
              {t('sub.ready', language)}
            </p>
          </div>

          {/* Huge Voice Assistant Microphone Trigger */}
          <button
            onClick={() => handleQuickTap(onOpenVoice)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-amber-700 hover:bg-amber-50 flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ring-8 ring-white/30 shrink-0"
            aria-label="Talk to MANAS AI Voice Assistant"
          >
            <Mic className="w-10 h-10 sm:w-11 sm:h-11 text-amber-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 mt-1">
              Talk to Me
            </span>
          </button>
        </div>
      </div>

      {/* 2. Today's Recommended Activity Hero Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shrink-0 shadow-xs">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Today's Recommended Activity
              </span>
              <span className="text-xs font-bold text-stone-500">Level {patient.currentDifficultyLevel}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
              {t('card.today_game', language)}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Personalized theme: <strong>{preferredTheme}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => handleQuickTap(() => onStartGame('MEMORY'))}
          className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{t('btn.start_game', language)}</span>
        </button>
      </div>

      {/* 3. Eight Cognitive Domain Rehabilitation Activities */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 uppercase tracking-wider">
              Dementia Recovery Activities (8 Games)
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Evidence-based cognitive training for memory, attention, executive sequencing & recall
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
            8 / 8 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Game 1: Memory Match */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('MEMORY'))}
            className="p-4 sm:p-5 rounded-3xl bg-amber-50 hover:bg-amber-100/90 border-2 border-amber-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  Game 1 • Working Memory
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Heritage Memory Match
              </h4>
            </div>
          </button>

          {/* Game 2: Attention Finder */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('ATTENTION'))}
            className="p-4 sm:p-5 rounded-3xl bg-teal-50 hover:bg-teal-100/90 border-2 border-teal-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Eye className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900">
                  Game 2 • Visual Attention
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Focus & Wildlife Finder
              </h4>
            </div>
          </button>

          {/* Game 3: Pattern Sequence */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('PATTERN'))}
            className="p-4 sm:p-5 rounded-3xl bg-indigo-50 hover:bg-indigo-100/90 border-2 border-indigo-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900">
                  Game 3 • Pattern Logic
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Traditional Motif Weaver
              </h4>
            </div>
          </button>

          {/* Game 4: Daily Routine Sequencer */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('ROUTINE'))}
            className="p-4 sm:p-5 rounded-3xl bg-emerald-50 hover:bg-emerald-100/90 border-2 border-emerald-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                  Game 4 • ADL Daily Living
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Daily Routine Sequencer
              </h4>
            </div>
          </button>

          {/* Game 5: Word & Proverb Recall */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('LANGUAGE'))}
            className="p-4 sm:p-5 rounded-3xl bg-rose-50 hover:bg-rose-100/90 border-2 border-rose-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900">
                  Game 5 • Language & Word Retrieval
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Word & Proverb Recall
              </h4>
            </div>
          </button>

          {/* Game 6: Object Category Sorter */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('SPATIAL'))}
            className="p-4 sm:p-5 rounded-3xl bg-cyan-50 hover:bg-cyan-100/90 border-2 border-cyan-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <FolderTree className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-200/80 text-cyan-900">
                  Game 6 • Categorization
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Nature & Kitchen Sorter
              </h4>
            </div>
          </button>

          {/* Game 7: Story & Photo Memory Recall */}
          <button
            onClick={() => handleQuickTap(() => onStartGame('STORY'))}
            className="p-4 sm:p-5 rounded-3xl bg-violet-50 hover:bg-violet-100/90 border-2 border-violet-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <BookOpenCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-200/80 text-violet-900">
                  Game 7 • Episodic Recall
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Story & Memory Vignettes
              </h4>
            </div>
          </button>

          {/* Game 8: Relaxation & Peaceful Music */}
          <button
            onClick={() => handleQuickTap(onOpenRelaxation)}
            className="p-4 sm:p-5 rounded-3xl bg-orange-50 hover:bg-orange-100/90 border-2 border-orange-300 text-left transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-xs flex items-center gap-4 group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-200/80 text-orange-900">
                  Game 8 • Relaxation & Sound
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                Peaceful Flute & Breathing
              </h4>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Dementia Routine & Daily Care Schedule Strip */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-stone-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Dementia Daily Routine & Alarms
                </span>
                <span className="text-xs font-bold text-stone-500">10 Scheduled Steps</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                Structured Medication, Hydration & Sundowning Care
              </h3>
            </div>
          </div>

          <button
            onClick={() => handleQuickTap(onOpenReminders)}
            className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>Open Daily Routine & Timers</span>
          </button>
        </div>
      </div>

      {/* 5. Quick Daily Care & Memory Tiles */}
      <div>
        <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider mb-3 px-1">
          Daily Care, Music & Memories
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => handleQuickTap(onOpenRadio)}
            className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/70 hover:to-amber-200/80 border-2 border-amber-300 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-amber-950">
              Heritage Radio
            </span>
          </button>

          <button
            onClick={() => handleQuickTap(onOpenMemories)}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-400 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              {t('btn.memories', language)}
            </span>
          </button>

          <button
            onClick={() => handleQuickTap(onOpenReminders)}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-teal-50 border-2 border-stone-200 hover:border-teal-400 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              {t('btn.reminders', language)}
            </span>
          </button>

          <button
            onClick={() => handleQuickTap(onOpenRelaxation)}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-sky-50 border-2 border-stone-200 hover:border-sky-400 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              {t('btn.relax', language)}
            </span>
          </button>

          <button
            onClick={() => handleQuickTap(onOpenFamily)}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-rose-50 border-2 border-stone-200 hover:border-rose-400 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              {t('btn.family', language)}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Safe Haven SOS Reassurance Banner (Feeling Confused?) */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-emerald-950">
              Feeling Confused or Looking for Family?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium">
              Tap here anytime to hear where you are and connect with your daughter Priyanka.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleQuickTap(onOpenSafeHaven)}
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-2xl shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>I Need Reassurance</span>
        </button>
      </div>

      {/* Baseline Assessment Re-Calibrate Card */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-stone-900">Cognitive Calibration: </span>
            <span className="text-stone-600">
              {patient.baseline ? 'Baseline completed & calibrated' : 'Path B: No medical record needed'}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleQuickTap(onOpenBaseline)}
          className="text-xs font-bold text-amber-800 hover:text-amber-900 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 transition-colors"
        >
          {patient.baseline ? 'Retake Baseline' : 'Start Baseline'}
        </button>
      </div>
    </div>
  );
};
