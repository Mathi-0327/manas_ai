import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Languages, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Stethoscope, 
  X, 
  Check, 
  UserPlus, 
  Phone,
  Calendar,
  Lock,
  ArrowLeft,
  Users
} from 'lucide-react';
import { PatientProfile, SupportedLanguage, UserRole } from '../../types';
import { PatientRoute } from '../../App';
import { localDB, DEFAULT_PATIENTS } from '../../lib/storage';
import { audioService } from '../../lib/audioService';
import { LanguageSelectionScreen } from './LanguageSelectionScreen';

interface LoginPortalProps {
  onPatientLogin: (patient: PatientProfile, initialRoute?: PatientRoute) => void;
  onCaregiverLogin: (role: UserRole) => void;
}

const REGIONS = [
  'Assam (Guwahati & Tezpur)',
  'Meghalaya (Shillong & Jowai)',
  'Manipur (Imphal & Bishnupur)',
  'Tripura (Agartala)',
  'Mizoram (Aizawl)',
  'Nagaland (Kohima & Dimapur)',
  'Arunachal Pradesh (Itanagar)',
  'Sikkim (Gangtok)',
];

const AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    label: 'Elder 1',
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    label: 'Elder 2',
  },
  {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    label: 'Elder 3',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    label: 'Elder 4',
  },
];

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onPatientLogin,
  onCaregiverLogin,
}) => {
  // Step in Auth Flow: LOGIN (Profile/Form) -> LANGUAGE_SELECTION -> Main App
  const [currentStep, setCurrentStep] = useState<'LOGIN' | 'LANGUAGE_SELECTION'>('LOGIN');

  // Mode: EXISTING_PATIENT (Signed In) or NEW_REGISTRATION
  const [viewMode, setViewMode] = useState<'EXISTING_PATIENT' | 'NEW_REGISTRATION'>('EXISTING_PATIENT');

  // Registry & Active Patient State
  const [patientRegistry, setPatientRegistry] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [draftPatient, setDraftPatient] = useState<PatientProfile | null>(null);

  // New Registration Form Fields
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState<number>(70);
  const [regGender, setRegGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [regRegion, setRegRegion] = useState('Assam (Guwahati & Tezpur)');
  const [regAvatar, setRegAvatar] = useState(AVATARS[0].url);
  const [regCaregiverName, setRegCaregiverName] = useState('');
  const [regCaregiverContact, setRegCaregiverContact] = useState('');
  const [showEmergencyFields, setShowEmergencyFields] = useState(false);

  // Discreet Caregiver Access Modal State
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState('priyanka.care@manas.health');
  const [caregiverPassword, setCaregiverPassword] = useState('');
  const [caregiverRole, setCaregiverRole] = useState<UserRole>('CAREGIVER');
  const [authError, setAuthError] = useState<string | null>(null);

  // Load registry on mount
  useEffect(() => {
    const registry = localDB.getPatientRegistry();
    setPatientRegistry(registry);

    const active = localDB.getPatientProfile();
    if (active && registry.some((p) => p.id === active.id)) {
      setSelectedPatient(active);
      setViewMode('EXISTING_PATIENT');
    } else if (registry.length > 0) {
      setSelectedPatient(registry[0]);
      setViewMode('EXISTING_PATIENT');
    } else {
      setViewMode('NEW_REGISTRATION');
    }
  }, []);

  // 1. Handle Existing Patient Continue -> Proceed to Language Selection
  const handleExistingPatientContinue = (patient: PatientProfile) => {
    setAuthError(null);
    audioService.playFeedbackSound('GENTLE_TAP');
    setDraftPatient(patient);
    setCurrentStep('LANGUAGE_SELECTION');
  };

  // 2. Handle New Registration Form Submit -> Proceed to Language Selection
  const handleNewRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setAuthError('Please enter the patient full name');
      return;
    }

    setAuthError(null);
    audioService.playFeedbackSound('GENTLE_TAP');

    const newProfile: PatientProfile = {
      id: `patient-${Date.now()}`,
      name: regName.trim(),
      age: Number(regAge) || 70,
      gender: regGender,
      region: regRegion,
      preferredLanguage: 'en',
      avatarUrl: regAvatar,
      culturalInterests: [
        'Traditional Folk Music & Tales',
        'Bihu & Tea Gardening',
        'Morning Walks & Peaceful Rest',
      ],
      medicalDataProvided: false,
      caregiverName: regCaregiverName.trim() || 'Family Caregiver',
      caregiverContact: regCaregiverContact.trim() || '+91 98000 00000',
      baseline: null,
      currentDifficultyLevel: 2,
      fatigueScore: 10,
      lastSyncTimestamp: new Date().toISOString(),
      syncStatus: 'SYNCED',
    };

    setDraftPatient(newProfile);
    setCurrentStep('LANGUAGE_SELECTION');
  };

  // 3. Final Step: Language Selected -> Save Profile and Enter App
  const handleFinalizeWithLanguage = (chosenLang: SupportedLanguage) => {
    if (!draftPatient) return;

    const saved = localDB.registerOrUpdatePatient({
      ...draftPatient,
      preferredLanguage: chosenLang,
    });

    localDB.setLoggedInSession('PATIENT', saved.id);
    audioService.playFeedbackSound('SUCCESS');

    onPatientLogin(saved, 'HOME');
  };

  // Caregiver Login Handler
  const handleCaregiverSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverEmail.trim() || !caregiverPassword.trim()) {
      setAuthError('Please enter caregiver email and PIN');
      return;
    }

    if (caregiverPassword !== '2703') {
      setAuthError('Invalid passcode. Please check and try again.');
      audioService.playFeedbackSound('GENTLE_TAP');
      return;
    }

    setAuthError(null);
    audioService.playFeedbackSound('SUCCESS');
    localDB.setLoggedInSession(caregiverRole, null);
    setShowCaregiverModal(false);
    onCaregiverLogin(caregiverRole);
  };

  const handleQuickDemoCaregiver = (role: UserRole, email: string) => {
    setCaregiverRole(role);
    setCaregiverEmail(email);
    setCaregiverPassword('');
    setAuthError(null);
  };

  // Render Step 2: Language Selection Screen
  if (currentStep === 'LANGUAGE_SELECTION' && draftPatient) {
    return (
      <LanguageSelectionScreen
        patientName={draftPatient.name.split(' ')[0]}
        initialLanguage={draftPatient.preferredLanguage || 'en'}
        onSelectLanguageAndContinue={handleFinalizeWithLanguage}
        onBackToLogin={() => setCurrentStep('LOGIN')}
      />
    );
  }

  // Render Step 1: Patient Login / Registration Screen
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-orange-400/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#78350f 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl shadow-[0_20px_50px_-15px_rgba(180,83,9,0.15)] overflow-hidden z-10 relative my-4">
        
        {/* Top Gradient Banner */}
        <div className="h-2.5 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600" />

        {/* Header with App Name & Logo */}
        <div className="pt-6 pb-4 px-6 sm:px-8 border-b border-stone-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Glowing App Emblem */}
            <div
              className="relative w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center p-2.5 transition-all"
              style={{
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #059669 100%)',
                boxShadow: '0 8px 20px -4px rgba(217, 119, 6, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              }}
            >
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                <path d="M20 34C20 34 8 26.5 8 17.5C8 12.5 12 8.5 17 8.5C18.8 8.5 20 9.8 20 9.8C20 9.8 21.2 8.5 23 8.5C28 8.5 32 12.5 32 17.5C32 26.5 20 34 20 34Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5 19C13.5 15.4 16.4 12.5 20 12.5C23.6 12.5 26.5 15.4 26.5 19C26.5 23 20 28.5 20 28.5C20 28.5 13.5 23 13.5 19Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="18.5" r="2.5" fill="white" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-stone-900">
                  MANAS AI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-extrabold uppercase tracking-wider">
                  Patient Login
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Cognitive Health & Memory Companion
              </p>
            </div>
          </div>

          {/* Caregiver Portal Quick Link */}
          <button
            type="button"
            onClick={() => {
              setShowCaregiverModal(true);
              setAuthError(null);
              audioService.playFeedbackSound('GENTLE_TAP');
            }}
            className="p-2 rounded-xl bg-stone-100 hover:bg-amber-50 border border-stone-200 text-stone-600 hover:text-amber-800 transition-all cursor-pointer shrink-0"
            title="Caregiver Portal"
          >
            <Stethoscope className="w-4 h-4 text-amber-600" />
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="mx-6 sm:mx-8 my-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 1: EXISTING PATIENT (ALREADY SIGNED IN / REGISTERED)           */}
        {/* ========================================================================= */}
        {viewMode === 'EXISTING_PATIENT' && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-stone-900">
                  Select Patient Profile
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Choose your profile to proceed to language selection
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewMode('NEW_REGISTRATION');
                  setRegName('');
                  setRegAge(68);
                  setRegGender('FEMALE');
                  setRegRegion('Assam (Guwahati & Tezpur)');
                  setRegAvatar(AVATARS[1].url);
                  audioService.playFeedbackSound('GENTLE_TAP');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ New Registration</span>
              </button>
            </div>

            {/* List of Registered Patients */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {patientRegistry.map((patient) => {
                const isSelected = selectedPatient?.id === patient.id;
                return (
                  <div
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      audioService.playFeedbackSound('GENTLE_TAP');
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={patient.avatarUrl || AVATARS[0].url}
                        alt={patient.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-stone-900 truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{patient.region.split(' ')[0]} • Age {patient.age}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-stone-400">Select</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Selected Patient Continue Button */}
            {selectedPatient && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleExistingPatientContinue(selectedPatient)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-black text-base shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>Select Language & Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Switch to New Registration Banner */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
              <p className="text-xs text-stone-600 font-medium">
                Want to register a different patient?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('NEW_REGISTRATION');
                    setRegName('');
                    setRegAge(68);
                    setRegGender('FEMALE');
                    setRegRegion('Assam (Guwahati & Tezpur)');
                    setRegAvatar(AVATARS[1].url);
                    audioService.playFeedbackSound('GENTLE_TAP');
                  }}
                  className="text-amber-800 font-extrabold hover:underline cursor-pointer"
                >
                  Create New Registration
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: NEW PATIENT REGISTRATION                                    */}
        {/* ========================================================================= */}
        {viewMode === 'NEW_REGISTRATION' && (
          <form onSubmit={handleNewRegistrationSubmit} className="p-6 sm:p-8 space-y-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h2 className="text-base sm:text-lg font-black text-stone-900">
                  New Patient Registration
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Fill in patient details to create profile
                </p>
              </div>

              {patientRegistry.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('EXISTING_PATIENT');
                    audioService.playFeedbackSound('GENTLE_TAP');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Existing Patients</span>
                </button>
              )}
            </div>

            {/* 1. Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maya Devi"
                    className="w-full bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm font-bold text-stone-900 outline-none transition-colors"
                    required
                    autoFocus
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Age *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    min={40}
                    max={110}
                    className="w-full bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-500 rounded-xl px-3 py-2.5 pl-8 text-xs sm:text-sm font-bold text-stone-900 outline-none transition-colors"
                    required
                  />
                  <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* 2. Gender & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setRegGender(g)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        regGender === g
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Region / State
                </label>
                <div className="relative">
                  <select
                    value={regRegion}
                    onChange={(e) => setRegRegion(e.target.value)}
                    className="w-full bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-500 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 outline-none appearance-none"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3. Photo Avatar */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Choose Photo Avatar
              </label>
              <div className="flex items-center gap-2.5">
                {AVATARS.map((av, idx) => (
                  <button
                    key={av.url}
                    type="button"
                    onClick={() => {
                      setRegAvatar(av.url);
                      audioService.playFeedbackSound('GENTLE_TAP');
                    }}
                    className={`p-1 rounded-2xl border-2 transition-all cursor-pointer ${
                      regAvatar === av.url
                        ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105 shadow-sm'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={`Avatar ${idx + 1}`}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Caregiver / Emergency Contact */}
            <div>
              <button
                type="button"
                onClick={() => setShowEmergencyFields(!showEmergencyFields)}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{showEmergencyFields ? '− Hide Emergency Contact' : '+ Add Caregiver / Emergency Contact'}</span>
              </button>

              {showEmergencyFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 p-3 bg-amber-50/50 border border-amber-200/80 rounded-2xl animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 mb-1">
                      Caregiver Name
                    </label>
                    <input
                      type="text"
                      value={regCaregiverName}
                      onChange={(e) => setRegCaregiverName(e.target.value)}
                      placeholder="e.g. Priyanka Kumar"
                      className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 mb-1">
                      Emergency Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regCaregiverContact}
                        onChange={(e) => setRegCaregiverContact(e.target.value)}
                        placeholder="+91 98640 12345"
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 pl-7 text-xs font-bold text-stone-900 outline-none"
                      />
                      <Phone className="w-3 h-3 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-black text-base shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Register & Select Language</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="py-3 px-6 sm:px-8 bg-stone-50 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
          <span className="text-[11px] flex items-center gap-1.5 text-stone-600 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            100% Offline & Private Encrypted
          </span>
          <span className="text-[11px] text-stone-400 font-medium">
            North East Cognitive Health
          </span>
        </div>
      </div>

      {/* Discreet Caregiver Login Modal */}
      {showCaregiverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-stone-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Caregiver Portal
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Clinical & Family Dashboard
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCaregiverModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Profile Selection */}
            <div className="mb-4">
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-2">
                Select Caregiver Account
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoCaregiver('CAREGIVER', 'priyanka.care@manas.health')}
                  className="p-2.5 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer"
                >
                  <p className="font-bold text-xs text-stone-900">Priyanka K.</p>
                  <p className="text-[10px] text-amber-700 font-semibold">Primary Caregiver</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoCaregiver('HEALTHCARE_WORKER', 'dr.sharma@ner-health.org')}
                  className="p-2.5 bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-400 rounded-xl text-left transition-all cursor-pointer"
                >
                  <p className="font-bold text-xs text-stone-900">Dr. Sharma</p>
                  <p className="text-[10px] text-teal-700 font-semibold">Neurologist</p>
                </button>
              </div>
            </div>

            {/* PIN Passcode Form */}
            <form onSubmit={handleCaregiverSignIn} className="space-y-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Passcode PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={caregiverPassword}
                    onChange={(e) => setCaregiverPassword(e.target.value)}
                    placeholder="••••"
                    autoComplete="new-password"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-center font-mono text-base font-bold text-stone-900 outline-none tracking-widest"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {authError && (
                  <p className="text-[11px] text-rose-600 mt-1 text-center font-medium">
                    {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all mt-2 cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
