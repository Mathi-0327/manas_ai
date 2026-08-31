import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  PatientProfile, 
  GameSessionResult, 
  AIObservation, 
  ReminderItem, 
  CaregiverInstruction 
} from '../../types';
import { localDB } from '../../lib/storage';
import { AICaregiverCopilot } from './AICaregiverCopilot';
import { CaregiverInstructionForm } from './CaregiverInstructionForm';
import { CaregiverMemoryManager } from './CaregiverMemoryManager';
import { ClinicalReportModal } from './ClinicalReportModal';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Brain, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Heart, 
  MessageSquare, 
  Pill, 
  Sliders, 
  Sparkles, 
  ShieldAlert, 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  Layers, 
  FileText, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bell,
  Droplets,
  Plus
} from 'lucide-react';

interface CaregiverDashboardProps {
  currentRole: UserRole;
  networkState: 'ONLINE' | 'OFFLINE' | 'LOW_CONNECTIVITY';
  onTriggerSync: () => void;
  pendingSyncCount: number;
}

type CaregiverTab =
  | 'OVERVIEW'
  | 'AI_OBSERVATIONS'
  | 'COPILOT'
  | 'INSTRUCTIONS'
  | 'MEMORIES'
  | 'REMINDERS'
  | 'TIMELINE'
  | 'MEDICAL_PROFILE'
  | 'HUMAN_REVIEW';

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  currentRole,
  networkState,
  onTriggerSync,
  pendingSyncCount,
}) => {
  const [activeTab, setActiveTab] = useState<CaregiverTab>('OVERVIEW');
  const [patientRegistry, setPatientRegistry] = useState<PatientProfile[]>(() => localDB.getPatientRegistry());
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => localDB.getActivePatientId());
  const [patient, setPatient] = useState<PatientProfile>(() => localDB.getPatientProfile());
  const [sessions, setSessions] = useState<GameSessionResult[]>(() => localDB.getGameSessions());
  const [observations, setObservations] = useState<AIObservation[]>(() => localDB.getObservations());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => localDB.getReminders());
  const [instructions, setInstructions] = useState<CaregiverInstruction[]>(() => localDB.getCaregiverInstructions());
  const [syncTimeline, setSyncTimeline] = useState<any[]>(() => localDB.getSyncQueue());
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Refresh State
  const refreshAll = () => {
    const registry = localDB.getPatientRegistry();
    setPatientRegistry(registry);
    const active = localDB.getPatientById(selectedPatientId) || localDB.getPatientProfile();
    setPatient(active);
    setSessions(localDB.getGameSessions(active.id));
    setObservations(localDB.getObservations(active.id));
    setReminders(localDB.getReminders(active.id));
    setInstructions(localDB.getCaregiverInstructions(active.id));
    setSyncTimeline(localDB.getSyncQueue());
  };

  const handleSelectPatient = (p: PatientProfile) => {
    setSelectedPatientId(p.id);
    setPatient(p);
    localDB.setActivePatientId(p.id);
    setSessions(localDB.getGameSessions(p.id));
    setObservations(localDB.getObservations(p.id));
    setReminders(localDB.getReminders(p.id));
    setInstructions(localDB.getCaregiverInstructions(p.id));
  };

  // Dynamically compute 7-day trend data from the selected patient's cognitive baseline
  const baseMem = patient.baseline?.memoryScore || 75;
  const baseAtt = patient.baseline?.attentionScore || 70;
  const basePat = patient.baseline?.patternScore || 80;
  const baseLat = patient.baseline ? +(patient.baseline.responseSpeedMs / 1000).toFixed(1) : 3.0;

  const trendData = [
    { day: 'Mon', memory: Math.max(50, baseMem - 4), attention: Math.max(50, baseAtt - 3), pattern: Math.max(50, basePat - 2), latency: +(baseLat + 0.3).toFixed(1) },
    { day: 'Tue', memory: Math.max(50, baseMem - 1), attention: Math.max(50, baseAtt + 2), pattern: Math.max(50, basePat + 1), latency: +(baseLat + 0.1).toFixed(1) },
    { day: 'Wed', memory: Math.max(50, baseMem - 5), attention: Math.max(50, baseAtt - 4), pattern: Math.max(50, basePat - 3), latency: +(baseLat + 0.5).toFixed(1) },
    { day: 'Thu', memory: Math.max(50, baseMem + 3), attention: Math.max(50, baseAtt + 3), pattern: Math.max(50, basePat + 4), latency: +(baseLat - 0.2).toFixed(1) },
    { day: 'Fri', memory: Math.max(50, baseMem + 1), attention: Math.max(50, baseAtt + 2), pattern: Math.max(50, basePat + 2), latency: +(baseLat - 0.1).toFixed(1) },
    { day: 'Sat', memory: Math.min(100, baseMem + 4), attention: Math.min(100, baseAtt + 5), pattern: Math.min(100, basePat + 5), latency: +(baseLat - 0.3).toFixed(1) },
    { day: 'Sun (Today)', memory: baseMem, attention: baseAtt, pattern: basePat, latency: baseLat },
  ];

  const cognitiveStabilityPercent = patient.baseline 
    ? Math.round((patient.baseline.memoryScore + patient.baseline.attentionScore + patient.baseline.patternScore) / 3) 
    : 82;

  const adherenceData = [
    { name: 'Morning Pills', adherence: patient.baseline ? Math.min(100, patient.baseline.memoryScore + 15) : 94 },
    { name: 'Noon Hydration', adherence: 88 },
    { name: 'Evening Routine', adherence: patient.baseline ? Math.min(100, patient.baseline.attentionScore + 16) : 90 },
  ];

  // Human In The Loop Recommendation Item State
  const [hitlRecommendations, setHitlRecommendations] = useState([
    {
      id: 'rec-1',
      title: 'Shift Memory Challenges to Morning Hours',
      rationale: `${patient.name}'s response speed is faster in the morning between 9:00 AM – 11:30 AM compared to afternoon sessions.`,
      proposedAction: `Schedule Level ${patient.currentDifficultyLevel} Heritage Memory game before 11:00 AM.`,
      status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
    },
    {
      id: 'rec-2',
      title: `Introduce Calming Evening Music at 6:00 PM`,
      rationale: 'Late afternoon sessions show mild mental fatigue; gentle acoustic stimulation promotes evening relaxation.',
      proposedAction: 'Auto-suggest Relaxation & Breathing module at sunset.',
      status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
    },
  ]);

  const handleHitlAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setHitlRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Multi-Patient Selector & Overview Strip */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Registered Patients ({patientRegistry.length})
            </h2>
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">
              • Click any elder to view live cognitive telemetry
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50 font-bold">
              {sessions.length} Game Records Logged
            </span>
          </div>
        </div>

        {/* Horizontal Patient Chip Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {patientRegistry.map((p) => {
            const isSelected = p.id === patient.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPatient(p)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-teal-700/40 border-teal-400 shadow-md ring-2 ring-teal-400/50'
                    : 'bg-stone-800/60 border-stone-700 hover:bg-stone-800 text-stone-300'
                }`}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-teal-300/30 shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-sm truncate text-white">{p.name}</p>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-stone-400 truncate">
                    {p.age} yrs • {p.region.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-teal-300 font-semibold mt-0.5">
                    Level {p.currentDifficultyLevel} • Fatigue: {p.fatigueScore}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Patient Profile Summary Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-600 shadow-xs shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {patient.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-200">
                Patient ID: {patient.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                Status: Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Age {patient.age} • {patient.region} • Caregiver: <strong>{patient.caregiverName}</strong> ({patient.caregiverContact})
            </p>
          </div>
        </div>

        {/* Quick Sync & Offline Status & Report Export */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-teal-200" />
            <span>1-Click Clinical PDF</span>
          </button>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-stone-400 uppercase block">Local Queue</span>
            <span className="text-xs font-extrabold text-stone-800">
              {pendingSyncCount === 0 ? 'All Events Synced' : `${pendingSyncCount} Pending Sync`}
            </span>
          </div>
          <button
            onClick={onTriggerSync}
            disabled={networkState === 'OFFLINE'}
            className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
            title="Force Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Cognitive Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_OBSERVATIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'AI_OBSERVATIONS'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>AI Observations</span>
        </button>

        <button
          onClick={() => setActiveTab('COPILOT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'COPILOT'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Copilot</span>
        </button>

        <button
          onClick={() => setActiveTab('INSTRUCTIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'INSTRUCTIONS'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Caregiver Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('MEMORIES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'MEMORIES'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Memory Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('REMINDERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'REMINDERS'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Routine & Alarms</span>
        </button>

        <button
          onClick={() => setActiveTab('HUMAN_REVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'HUMAN_REVIEW'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Human-in-the-Loop</span>
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'TIMELINE'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Patient Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('MEDICAL_PROFILE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'MEDICAL_PROFILE'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Records</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & COGNITIVE TRENDS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase">Cognitive Stability</span>
              <p className="text-3xl font-extrabold text-stone-900 mt-1">{cognitiveStabilityPercent}%</p>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
                +4% over last week
              </span>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase">Reminder Adherence</span>
              <p className="text-3xl font-extrabold text-teal-800 mt-1">{patient.baseline ? Math.min(98, patient.baseline.memoryScore + 14) : 91}%</p>
              <span className="text-[11px] font-semibold text-stone-500 mt-1 block">
                Morning & hydration on track
              </span>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase">Average Latency</span>
              <p className="text-3xl font-extrabold text-stone-900 mt-1">{patient.baseline ? (patient.baseline.responseSpeedMs / 1000).toFixed(1) + 's' : '2.8s'}</p>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
                Steady response cadence
              </span>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase">Active AI Difficulty</span>
              <p className="text-3xl font-extrabold text-amber-700 mt-1">Level {patient.currentDifficultyLevel} / 5</p>
              <span className="text-[11px] font-semibold text-stone-500 mt-1 block">
                {patient.culturalInterests[0] || 'Heritage Memory Matching'}
              </span>
            </div>
          </div>

          {/* Daily AI Telemetry Summary Card */}
          <div className="p-6 bg-teal-900 text-white rounded-3xl shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-lg">Today's AI Behavioral Summary</h3>
            </div>
            <p className="text-sm sm:text-base text-teal-100 leading-relaxed max-w-4xl">
              "{patient.name} completed today's cognitive activities with steady engagement. Visual pattern recognition in {patient.region.split(' ')[0]} exercises reached {patient.baseline?.patternScore || 85}% accuracy with a calibrated response speed of {(patient.baseline ? patient.baseline.responseSpeedMs / 1000 : 2.8).toFixed(1)}s. Morning routine and reminders were acknowledged promptly on schedule."
            </p>
            <div className="mt-4 pt-3 border-t border-teal-700/60 flex flex-wrap items-center justify-between text-xs text-teal-200 gap-2">
              <span>Telemetry synced from local offline storage</span>
              <span className="bg-teal-800 px-3 py-1 rounded-full font-bold">
                Non-Clinical Behavioral Summary
              </span>
            </div>
          </div>

          {/* 7-Day Performance Trends Chart */}
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  7-Day Cognitive Domain Accuracy (%)
                </h3>
                <p className="text-xs text-stone-500">
                  Tracking Memory, Attention, and Pattern Recognition accuracy over daily sessions
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    name="Memory Recall (%)"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attention"
                    name="Visual Attention (%)"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pattern"
                    name="Pattern Weave (%)"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Adherence & Response Speed Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <h3 className="text-base font-extrabold text-stone-900 mb-1">
                Routine & Medication Adherence (%)
              </h3>
              <p className="text-xs text-stone-500 mb-4">Timely acknowledgment of care reminders</p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="adherence" fill="#0d9488" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
              <h3 className="text-base font-extrabold text-stone-900 mb-1">
                Response Latency Trend (Seconds)
              </h3>
              <p className="text-xs text-stone-500 mb-4">Average response speed per session</p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[1, 5]} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      name="Response Time (s)"
                      stroke="#e11d48"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI OBSERVATIONS & EXPLAINABILITY */}
      {activeTab === 'AI_OBSERVATIONS' && (
        <div className="space-y-6">
          {/* Non-Diagnostic Disclaimer */}
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <strong>Mandated Clinical Safety Notice:</strong> AI observations represent behavioral engagement, response latencies, and interaction consistency. They are provided solely for caregiver situational awareness and must never be treated as clinical medical diagnoses.
            </div>
          </div>

          <div className="space-y-4">
            {observations.map((obs) => {
              const categoryLabel = (obs.category || (obs as any).observationType || 'TELEMETRY').replace(/_/g, ' ');
              const dateStr = obs.timestamp 
                ? new Date(obs.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : (obs as any).date || 'Today';
              const titleStr = obs.title || (obs as any).summary || 'Behavioral Observation';
              const detailsStr = obs.observation || (obs as any).details || '';
              const reasonStr = obs.explainabilityReason || (obs as any).rationale || '';
              const actionStr = (obs as any).recommendedCaregiverAction;

              return (
                <div
                  key={obs.id}
                  className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
                        {categoryLabel}
                      </span>
                      <span className="text-xs text-stone-400">{dateStr}</span>
                    </div>

                    <span className="text-xs font-bold text-stone-500">
                      Confidence: {Math.round((obs.confidenceScore ?? 0.85) * 100)}%
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-stone-900">
                    {titleStr}
                  </h4>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                    {detailsStr && (
                      <div>
                        <span className="font-bold text-stone-700">Detailed Telemetry: </span>
                        <span className="text-stone-600">{detailsStr}</span>
                      </div>
                    )}
                    {reasonStr && (
                      <div>
                        <span className="font-bold text-teal-800">Explainable Rationale: </span>
                        <span className="text-stone-700">{reasonStr}</span>
                      </div>
                    )}
                    {obs.metricsComparison && (
                      <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2 py-0.5 bg-white border border-stone-300 rounded font-semibold text-stone-700">
                          {obs.metricsComparison.metricName}: {obs.metricsComparison.recentValue} (vs {obs.metricsComparison.baselineValue})
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-bold">
                          {obs.metricsComparison.deviation}
                        </span>
                      </div>
                    )}
                  </div>

                  {actionStr && (
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-900 bg-teal-50 p-3 rounded-xl border border-teal-200">
                      <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Recommendation: {actionStr}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI COPILOT */}
      {activeTab === 'COPILOT' && (
        <AICaregiverCopilot patientId={patient.id} networkState={networkState} />
      )}

      {/* TAB 4: INSTRUCTIONS OVERLAY */}
      {activeTab === 'INSTRUCTIONS' && (
        <CaregiverInstructionForm
          patientId={patient.id}
          networkState={networkState}
          onInstructionSaved={refreshAll}
        />
      )}

      {/* TAB 5: MEMORIES MANAGER */}
      {activeTab === 'MEMORIES' && (
        <CaregiverMemoryManager
          patientId={patient.id}
          networkState={networkState}
          onMemoryUpdated={refreshAll}
        />
      )}

      {/* TAB: ROUTINE & ALARMS MANAGER */}
      {activeTab === 'REMINDERS' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <span>Patient Daily Routine & Timed Care Schedule ({reminders.length} Steps)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                24-hour structured cueing schedule for {patient.name}. Tracks medication, hydration, sundowning music, and rest.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                {reminders.filter(r => r.status === 'ACKNOWLEDGED').length} / {reminders.length} Completed Today
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((rem) => {
              const isDone = rem.status === 'ACKNOWLEDGED';
              return (
                <div
                  key={rem.id}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-stone-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>{rem.scheduledTime}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {rem.timeOfDay}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-200 text-emerald-950'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isDone ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-stone-900">{rem.title}</h4>
                  <p className="text-xs font-bold text-stone-600 mt-1">
                    {rem.dosageOrInstruction || 'Scheduled dementia care item'}
                  </p>

                  {rem.voicePromptText && (
                    <p className="text-[11px] text-stone-500 italic mt-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                      Spoken prompt: "{rem.voicePromptText}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs font-semibold">
                    <span className="text-stone-500">
                      Type: <strong className="text-stone-800">{rem.type}</strong>
                    </span>

                    {isDone ? (
                      <span className="text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified by Patient</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold">Awaiting Scheduled Time</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: HUMAN IN THE LOOP REVIEW */}
      {activeTab === 'HUMAN_REVIEW' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
            <h3 className="text-lg font-extrabold text-stone-900">
              Human-in-the-Loop AI Adaptation Review
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Caregivers and healthcare workers review and approve proposed AI schedule shifts, theme selections, or difficulty updates before execution.
            </p>
          </div>

          <div className="space-y-4">
            {hitlRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 bg-white rounded-3xl border-2 border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-stone-900">{rec.title}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rec.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : rec.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600">
                  <strong>Rationale:</strong> {rec.rationale}
                </p>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800">
                  Proposed Action: {rec.proposedAction}
                </div>

                {rec.status === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleHitlAction(rec.id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve AI Recommendation</span>
                    </button>
                    <button
                      onClick={() => handleHitlAction(rec.id, 'REJECTED')}
                      className="px-4 py-2 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-200"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PATIENT SYNC TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
            <h3 className="text-lg font-extrabold text-stone-900">
              Synced Patient Activity & Telemetry Audit Trail
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Live chronological log of all interactions recorded offline and synced to the cloud
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-xs">
            <div className="space-y-4">
              {sessions.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm">
                        Completed {s.gameId} ({s.category})
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Score: {s.score}% • Accuracy: {s.accuracyPercent}% • Latency: {(s.avgResponseTimeMs / 1000).toFixed(1)}s • Difficulty: Level {s.difficulty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MEDICAL PROFILE (SEPARATE FROM AI OBSERVATIONS) */}
      {activeTab === 'MEDICAL_PROFILE' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope className="w-6 h-6 text-teal-800" />
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  Verified Clinical Records (Path A)
                </h3>
                <p className="text-xs text-stone-500">
                  Strictly separated from AI observations. Verified by licensed physicians & healthcare workers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase">Physician</span>
                <p className="text-sm font-extrabold text-stone-900 mt-0.5">
                  {patient.region.includes('Meghalaya') ? 'Dr. D. Sangma, MD' : patient.region.includes('Manipur') ? 'Dr. Th. Singh, MD' : 'Dr. B. Barua, MD'}
                </p>
                <p className="text-xs text-stone-500">
                  {patient.region.includes('Meghalaya') ? 'Shillong Civil Hospital, Meghalaya' : patient.region.includes('Manipur') ? 'RIMS Regional Institute, Imphal' : 'Tezpur Civil Hospital, Assam'}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase">Clinical Stage</span>
                <p className="text-sm font-extrabold text-stone-900 mt-0.5">
                  {patient.baseline && patient.baseline.memoryScore >= 80 ? 'Early Cognitive Health Support' : 'Mild Cognitive Impairment (MCI)'}
                </p>
                <p className="text-xs text-stone-500">Calibrated via Onboarding Baseline</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase">Emergency Contact</span>
                <p className="text-sm font-extrabold text-stone-900 mt-0.5">{patient.caregiverName || 'Primary Family Caregiver'}</p>
                <p className="text-xs text-stone-500">{patient.caregiverContact || '+91 98000 00000'} • {patient.region}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase">Onboarding Architecture</span>
                <p className="text-sm font-extrabold text-teal-800 mt-0.5">Path B (AI Behavioral Baseline)</p>
                <p className="text-xs text-stone-500">Calibrated with {patient.preferredLanguage.toUpperCase()} regional interface</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Clinical Summary & Export Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={patient}
        observations={observations}
        sessions={sessions}
      />
    </div>
  );
};
