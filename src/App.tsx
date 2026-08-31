import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
  SupportedLanguage, 
  GameCategory, 
  PatientProfile, 
  CaregiverInstruction 
} from './types';
import { localDB } from './lib/storage';
import { audioService } from './lib/audioService';
import { OpeningSplashScreen } from './components/AuthPortal/OpeningSplashScreen';
import { LoginPortal } from './components/AuthPortal/LoginPortal';
import { NavigationHeader } from './components/NavigationHeader';
import { MobileBottomNav } from './components/PatientPortal/MobileBottomNav';
import { PatientHome } from './components/PatientPortal/PatientHome';
import { VoiceAssistantModal } from './components/PatientPortal/VoiceAssistantModal';
import { BaselineAssessment } from './components/PatientPortal/BaselineAssessment';
import { MemoryMatchGame } from './components/PatientPortal/CognitiveGames/MemoryMatchGame';
import { AttentionFinderGame } from './components/PatientPortal/CognitiveGames/AttentionFinderGame';
import { PatternSequenceGame } from './components/PatientPortal/CognitiveGames/PatternSequenceGame';
import { RoutineSequencerGame } from './components/PatientPortal/CognitiveGames/RoutineSequencerGame';
import { WordRecallGame } from './components/PatientPortal/CognitiveGames/WordRecallGame';
import { ObjectCategorySortGame } from './components/PatientPortal/CognitiveGames/ObjectCategorySortGame';
import { StoryRecallGame } from './components/PatientPortal/CognitiveGames/StoryRecallGame';
import { RelaxationMusicGame } from './components/PatientPortal/CognitiveGames/RelaxationMusicGame';
import { MemoryVaultView } from './components/PatientPortal/MemoryVaultView';
import { RemindersView } from './components/PatientPortal/RemindersView';
import { FamilyAudioView } from './components/PatientPortal/FamilyAudioView';
import { ReminiscenceRadioView } from './components/PatientPortal/ReminiscenceRadioView';
import { SafeHavenReassuranceModal } from './components/PatientPortal/SafeHavenReassuranceModal';
import { CaregiverDashboard } from './components/CaregiverPortal/CaregiverDashboard';
import { DemoWalkthroughBar, DEMO_STEPS } from './components/DemoWalkthroughBar';

export type PatientRoute =
  | 'HOME'
  | 'GAMES'
  | 'MEMORIES'
  | 'REMINDERS'
  | 'RELAX'
  | 'RADIO'
  | 'FAMILY'
  | 'BASELINE';

export default function App() {
  // Opening Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Session Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localDB.getLoggedInSession();
    return session.role !== null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = localDB.getLoggedInSession();
    return session.role || 'PATIENT';
  });

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    const profile = localDB.getPatientProfile();
    return profile.preferredLanguage || 'en';
  });
  const [networkState, setNetworkState] = useState<'ONLINE' | 'OFFLINE' | 'LOW_CONNECTIVITY'>('ONLINE');
  const [patientRoute, setPatientRoute] = useState<PatientRoute>('HOME');
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('MEMORY');
  
  // Data State
  const [patient, setPatient] = useState<PatientProfile>(() => localDB.getPatientProfile());
  const [instructions, setInstructions] = useState<CaregiverInstruction[]>(() => localDB.getCaregiverInstructions());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals & Demo Guide
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isSafeHavenOpen, setIsSafeHavenOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const refreshState = useCallback(() => {
    const active = localDB.getPatientProfile();
    setPatient(active);
    if (active.preferredLanguage) {
      setCurrentLang(active.preferredLanguage);
    }
    setInstructions(localDB.getCaregiverInstructions(active.id));
    setPendingSyncCount(localDB.getPendingSyncCount());
  }, []);

  useEffect(() => {
    refreshState();
    // Poll pending sync events
    const interval = setInterval(() => {
      setPendingSyncCount(localDB.getPendingSyncCount());
    }, 2000);
    return () => clearInterval(interval);
  }, [refreshState]);

  // Handle Patient Login (Invoked after Language Selection)
  const handlePatientLogin = (profile: PatientProfile, initialRoute: PatientRoute = 'HOME') => {
    setPatient(profile);
    setCurrentLang(profile.preferredLanguage || 'en');
    setCurrentRole('PATIENT');
    setIsAuthenticated(true);
    setPatientRoute(initialRoute);
    refreshState();
  };

  // Handle Caregiver Login
  const handleCaregiverLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    refreshState();
  };

  // Switch role to Caregiver
  const handleSwitchToCaregiver = (role: UserRole = 'CAREGIVER') => {
    localDB.setLoggedInSession(role, null);
    setCurrentRole(role);
    refreshState();
  };

  // Switch role to Patient
  const handleSwitchToPatient = () => {
    const active = localDB.getPatientProfile();
    localDB.setLoggedInSession('PATIENT', active.id);
    setCurrentRole('PATIENT');
    setPatientRoute('HOME');
    refreshState();
  };

  // Handle Logout / Switch Profile
  const handleLogout = () => {
    localDB.clearSession();
    setIsAuthenticated(false);
    setIsVoiceOpen(false);
    setIsSafeHavenOpen(false);
    audioService.playFeedbackSound('GENTLE_TAP');
  };

  // Sync Engine: Flushes local offline queue to server API
  const handleTriggerSync = async () => {
    if (networkState === 'OFFLINE' || isSyncing) return;

    setIsSyncing(true);
    const pendingEvents = localDB.getPendingEvents();

    if (pendingEvents.length === 0) {
      setTimeout(() => setIsSyncing(false), 400);
      return;
    }

    try {
      const res = await fetch('/api/sync/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: pendingEvents }),
      });

      if (res.ok) {
        localDB.markEventsSynced(pendingEvents.map((e) => e.eventId));
        setPendingSyncCount(0);
        audioService.playFeedbackSound('SUCCESS');
      }
    } catch {
      // If server unreachable, retain queue locally
    } finally {
      setIsSyncing(false);
      refreshState();
    }
  };

  const handleResetData = () => {
    localDB.resetToDemo();
    refreshState();
    setPatientRoute('HOME');
    audioService.playFeedbackSound('SUCCESS');
  };

  // Demo step action executor
  const handleExecuteDemoStep = (stepNum: number) => {
    const target = DEMO_STEPS[stepNum - 1];
    if (!target) return;

    if (target.role) {
      setCurrentRole(target.role as UserRole);
      setIsAuthenticated(true);
    }
    if (target.network) {
      setNetworkState(target.network as any);
    }

    // Step-specific routes
    switch (stepNum) {
      case 1:
        setPatientRoute('HOME');
        break;
      case 2:
        setNetworkState('OFFLINE');
        break;
      case 3:
        setNetworkState('OFFLINE');
        setIsVoiceOpen(true);
        break;
      case 4:
        setIsVoiceOpen(false);
        setActiveGameCategory('MEMORY');
        setPatientRoute('GAMES');
        break;
      case 5:
        setIsVoiceOpen(false);
        setActiveGameCategory('MEMORY');
        setPatientRoute('GAMES');
        break;
      case 6:
        setPatientRoute('REMINDERS');
        break;
      case 7:
        setNetworkState('ONLINE');
        handleTriggerSync();
        break;
      case 8:
        setPatientRoute('MEMORIES');
        break;
      case 9:
        setCurrentRole('CAREGIVER');
        break;
      case 10:
        setCurrentRole('CAREGIVER');
        break;
      case 11:
        setCurrentRole('CAREGIVER');
        break;
      case 12:
        setCurrentRole('CAREGIVER');
        break;
      default:
        break;
    }
  };

  // 1. Render Opening Splash Animation on initial app load
  if (showSplash) {
    return <OpeningSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. If not authenticated, render Login Portal with Language Selection Flow
  if (!isAuthenticated) {
    return (
      <LoginPortal
        onPatientLogin={handlePatientLogin}
        onCaregiverLogin={handleCaregiverLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header */}
      <NavigationHeader
        currentRole={currentRole}
        patient={patient}
        currentLang={currentLang}
        onLangChange={(l) => {
          setCurrentLang(l);
          audioService.playFeedbackSound('GENTLE_TAP');
        }}
        networkState={networkState}
        onNetworkChange={(s) => {
          setNetworkState(s);
          if (s === 'ONLINE') {
            handleTriggerSync();
          }
        }}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onResetData={handleResetData}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenSafeHaven={() => setIsSafeHavenOpen(true)}
        onSwitchToCaregiver={handleSwitchToCaregiver}
        onSwitchToPatient={handleSwitchToPatient}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* PATIENT PORTAL VIEWS (Caregiver features hidden from patient) */}
        {currentRole === 'PATIENT' && (
          <>
            {patientRoute === 'HOME' && (
              <PatientHome
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onOpenVoice={() => setIsVoiceOpen(true)}
                onStartGame={(category) => {
                  setActiveGameCategory(category);
                  setPatientRoute('GAMES');
                }}
                onOpenMemories={() => setPatientRoute('MEMORIES')}
                onOpenReminders={() => setPatientRoute('REMINDERS')}
                onOpenRelaxation={() => setPatientRoute('RELAX')}
                onOpenRadio={() => setPatientRoute('RADIO')}
                onOpenFamily={() => setPatientRoute('FAMILY')}
                onOpenBaseline={() => setPatientRoute('BASELINE')}
                onOpenSafeHaven={() => setIsSafeHavenOpen(true)}
              />
            )}

            {patientRoute === 'RADIO' && (
              <ReminiscenceRadioView
                onBack={() => setPatientRoute('HOME')}
                patientName={patient.name.split(' ')[0]}
              />
            )}

            {/* 8 COGNITIVE RECOVERY GAMES */}
            {patientRoute === 'GAMES' && activeGameCategory === 'MEMORY' && (
              <MemoryMatchGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'ATTENTION' && (
              <AttentionFinderGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'PATTERN' && (
              <PatternSequenceGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'ROUTINE' && (
              <RoutineSequencerGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'LANGUAGE' && (
              <WordRecallGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'SPATIAL' && (
              <ObjectCategorySortGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {patientRoute === 'GAMES' && activeGameCategory === 'STORY' && (
              <StoryRecallGame
                patient={patient}
                instructions={instructions}
                language={currentLang}
                onBack={() => setPatientRoute('HOME')}
                onGoToMemories={() => setPatientRoute('MEMORIES')}
              />
            )}

            {(patientRoute === 'RELAX' || (patientRoute === 'GAMES' && activeGameCategory === 'RELAX')) && (
              <RelaxationMusicGame
                onBack={() => setPatientRoute('HOME')}
                patientName={patient.name.split(' ')[0]}
              />
            )}

            {patientRoute === 'MEMORIES' && (
              <MemoryVaultView
                onBack={() => setPatientRoute('HOME')}
                language={currentLang}
                patientName={patient.name.split(' ')[0]}
                networkState={networkState}
              />
            )}

            {patientRoute === 'REMINDERS' && (
              <RemindersView
                onBack={() => setPatientRoute('HOME')}
                language={currentLang}
                patientName={patient.name.split(' ')[0]}
              />
            )}

            {patientRoute === 'FAMILY' && (
              <FamilyAudioView
                onBack={() => setPatientRoute('HOME')}
                patientName={patient.name.split(' ')[0]}
              />
            )}

            {patientRoute === 'BASELINE' && (
              <BaselineAssessment
                language={currentLang}
                patientName={patient.name.split(' ')[0]}
                onComplete={(baseline) => {
                  refreshState();
                  setPatientRoute('HOME');
                }}
                onCancel={() => setPatientRoute('HOME')}
              />
            )}
          </>
        )}

        {/* CAREGIVER & CLINICAL PORTAL */}
        {(currentRole === 'CAREGIVER' || currentRole === 'HEALTHCARE_WORKER') && (
          <CaregiverDashboard
            currentRole={currentRole}
            networkState={networkState}
            onTriggerSync={handleTriggerSync}
            pendingSyncCount={pendingSyncCount}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation for Patient Companion */}
      {currentRole === 'PATIENT' && (
        <MobileBottomNav
          currentRoute={patientRoute}
          onRouteChange={(route) => setPatientRoute(route)}
          language={currentLang}
          onOpenVoice={() => setIsVoiceOpen(true)}
        />
      )}

      {/* Voice Assistant Modal with Turn-Taking & Multilingual Dialects */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        patientName={patient.name.split(' ')[0]}
        language={currentLang}
        networkState={networkState}
        onNavigate={(route) => {
          setPatientRoute(route);
          setIsVoiceOpen(false);
        }}
      />

      {/* Safe Haven SOS Reassurance Modal */}
      <SafeHavenReassuranceModal
        isOpen={isSafeHavenOpen}
        onClose={() => setIsSafeHavenOpen(false)}
        patient={patient}
        language={currentLang}
      />

      {/* 12-Step Demo Walkthrough Guide */}
      {isDemoGuideOpen && (
        <DemoWalkthroughBar
          currentStep={demoStep}
          onSetStep={(s) => setDemoStep(s)}
          onExecuteStepAction={handleExecuteDemoStep}
          onClose={() => setIsDemoGuideOpen(false)}
        />
      )}
    </div>
  );
}
