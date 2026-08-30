import { 
  PatientProfile, 
  SyncEvent, 
  GameSessionResult, 
  ReminderItem, 
  MemoryItem, 
  CaregiverInstruction, 
  AIObservation, 
  AIRecommendation,
  UserRole
} from '../types';

const STORAGE_KEYS = {
  PATIENT_PROFILE: 'manas_patient_profile',
  PATIENT_REGISTRY: 'manas_patient_registry',
  ACTIVE_PATIENT_ID: 'manas_active_patient_id',
  SESSION_AUTH: 'manas_session_auth',
  SYNC_QUEUE: 'manas_sync_queue',
  GAME_SESSIONS: 'manas_game_sessions',
  LOCAL_REMINDERS: 'manas_local_reminders',
  LOCAL_MEMORIES: 'manas_local_memories',
  CAREGIVER_INSTRUCTIONS: 'manas_caregiver_instructions',
  AI_OBSERVATIONS: 'manas_ai_observations',
  AI_RECOMMENDATIONS: 'manas_ai_recommendations',
  NETWORK_SIMULATION: 'manas_network_simulation',
};

// Initial fictional demo profile for North East Region
export const DEFAULT_PATIENTS: PatientProfile[] = [
  {
    id: 'patient-ravi-001',
    name: 'Ravi Kumar',
    age: 72,
    gender: 'MALE',
    region: 'Assam (Guwahati & Tezpur)',
    preferredLanguage: 'en',
    culturalInterests: [
      'Traditional Bihu & Flute Music',
      'Assam Tea Gardening & Farming',
      'Assamese Traditional Dishes',
      'Family & Village Festivals',
      'Bamboo Craft & Nature',
    ],
    medicalDataProvided: false,
    caregiverName: 'Priyanka Kumar (Daughter)',
    caregiverContact: '+91 98640 12345',
    baseline: {
      memoryScore: 74,
      attentionScore: 68,
      recallScore: 70,
      patternScore: 82,
      responseSpeedMs: 3200,
      engagementLevel: 'HIGH',
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      isInitialBaseline: true,
    },
    currentDifficultyLevel: 2,
    fatigueScore: 18,
    lastSyncTimestamp: new Date().toISOString(),
    syncStatus: 'SYNCED',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'patient-maya-002',
    name: 'Maya Devi',
    age: 68,
    gender: 'FEMALE',
    region: 'Meghalaya (Shillong)',
    preferredLanguage: 'en',
    culturalInterests: [
      'Pine Forest Walks & Gardening',
      'Traditional Weaving Patterns',
      'Folk Choirs & Singing',
      'Courtyard Tea Times',
    ],
    medicalDataProvided: false,
    caregiverName: 'Anil Devi (Son)',
    caregiverContact: '+91 98560 54321',
    baseline: {
      memoryScore: 82,
      attentionScore: 76,
      recallScore: 78,
      patternScore: 88,
      responseSpeedMs: 2900,
      engagementLevel: 'HIGH',
      completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isInitialBaseline: true,
    },
    currentDifficultyLevel: 3,
    fatigueScore: 12,
    lastSyncTimestamp: new Date().toISOString(),
    syncStatus: 'SYNCED',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'patient-biren-003',
    name: 'Biren Barua',
    age: 76,
    gender: 'MALE',
    region: 'Assam (Jorhat Tea Estate)',
    preferredLanguage: 'as',
    culturalInterests: [
      'Tea Plucking & Estate Life',
      'Kaziranga Nature & Birds',
      'Dhol & Bihu Melodies',
      'Proverbs & Storytelling',
    ],
    medicalDataProvided: false,
    caregiverName: 'Mridul Barua (Son)',
    caregiverContact: '+91 94350 98765',
    baseline: {
      memoryScore: 65,
      attentionScore: 62,
      recallScore: 60,
      patternScore: 70,
      responseSpeedMs: 3800,
      engagementLevel: 'MODERATE',
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isInitialBaseline: true,
    },
    currentDifficultyLevel: 2,
    fatigueScore: 24,
    lastSyncTimestamp: new Date().toISOString(),
    syncStatus: 'SYNCED',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  }
];

export const DEFAULT_PATIENT = DEFAULT_PATIENTS[0];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    patientId: 'patient-ravi-001',
    title: 'Granddaughter Ananya at Kaziranga',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    caption: 'Ananya holding binoculars watching one-horned rhinos in Kaziranga National Park',
    fullStory: 'In November 2023, you traveled with your daughter Priyanka and granddaughter Ananya to Kaziranga. Ananya was thrilled to spot a mother rhino and her calf near the elephant grass. You enjoyed drinking warm spiced tea together at the forest lodge.',
    peopleTagged: ['Ananya (Granddaughter)', 'Priyanka (Daughter)'],
    relationship: 'Granddaughter',
    location: 'Kaziranga, Assam',
    eventDateOrYear: 'November 2023',
    culturalTags: ['Kaziranga', 'Wildlife', 'Family Holiday', 'Assam Tea'],
    verifiedByCaregiver: true,
    isFavorite: true,
    createdDate: '2023-11-15',
  },
  {
    id: 'mem-2',
    patientId: 'patient-ravi-001',
    title: 'Rongali Bihu Festival with Dhol & Pepa',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    caption: 'Celebrating Rongali Bihu with family, playing the traditional Dhol drum',
    fullStory: 'You have loved playing the Bihu Dhol since your youth in Tezpur. Every April during Bohag Bihu, the courtyard was filled with Pitha, Laru, and the rhythm of Pepa and Gogona. You taught Ananya her first Bihu beats.',
    peopleTagged: ['Ravi Kumar', 'Priyanka Kumar', 'Neighbor Bikash'],
    relationship: 'Cultural Celebration',
    location: 'Tezpur, Assam',
    eventDateOrYear: 'April 2021',
    culturalTags: ['Bihu', 'Folk Music', 'Dhol', 'Festival', 'Pitha'],
    verifiedByCaregiver: true,
    isFavorite: true,
    createdDate: '2021-04-14',
  },
  {
    id: 'mem-3',
    patientId: 'patient-ravi-001',
    title: 'Shillong Peak Family Excursion',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    caption: 'Panoramic misty view of Shillong hills during the Cherry Blossom season',
    fullStory: 'A serene autumn afternoon spent admiring the rolling green hills and pine trees of Meghalaya. You wore your favorite warm wool sweater and praised the crisp mountain air.',
    peopleTagged: ['Priyanka Kumar', 'Ravi Kumar'],
    relationship: 'Family Excursion',
    location: 'Shillong, Meghalaya',
    eventDateOrYear: 'October 2022',
    culturalTags: ['Shillong', 'Meghalaya', 'Pine Trees', 'Hills'],
    verifiedByCaregiver: true,
    isFavorite: false,
    createdDate: '2022-10-20',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    patientId: 'patient-ravi-001',
    title: 'Morning Hydration & Sunlight',
    type: 'HYDRATION',
    scheduledTime: '07:30 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: 'Drink 1 warm glass of water and enjoy 5 minutes of gentle morning balcony air',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    voicePromptText: 'Nomoskar Ravi! Please drink a refreshing cup of warm water and enjoy the morning sun.',
  },
  {
    id: 'rem-2',
    patientId: 'patient-ravi-001',
    title: 'Morning Memory & Blood Pressure Tablet',
    type: 'MEDICATION',
    scheduledTime: '08:15 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: '1 tablet with a warm glass of water after breakfast',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    voicePromptText: 'Ravi, it is time for your morning memory and blood pressure tablet with fresh water.',
  },
  {
    id: 'rem-3',
    patientId: 'patient-ravi-001',
    title: 'Morning Assam Tea & Memory Card Puzzle',
    type: 'ACTIVITY',
    scheduledTime: '10:00 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: 'Cup of warm Assam light tea followed by 5 minutes of heritage memory matching',
    status: 'PENDING',
    voicePromptText: 'Time for your morning tea and a fun 5-minute memory game with Bihu cards!',
  },
  {
    id: 'rem-4',
    patientId: 'patient-ravi-001',
    title: 'Mid-Day Hydration & Hand Wash',
    type: 'HYDRATION',
    scheduledTime: '12:30 PM',
    timeOfDay: 'AFTERNOON',
    dosageOrInstruction: 'Drink a glass of water and wash hands with pleasant warm soap before lunch',
    status: 'PENDING',
    voicePromptText: 'Time to drink a fresh glass of water and wash your hands before lunch.',
  },
  {
    id: 'rem-5',
    patientId: 'patient-ravi-001',
    title: 'Nourishing Lunch & Quiet Rest',
    type: 'ROUTINE',
    scheduledTime: '01:15 PM',
    timeOfDay: 'AFTERNOON',
    dosageOrInstruction: 'Enjoy a warm balanced meal with family, followed by 20 minutes relaxing rest',
    status: 'PENDING',
    voicePromptText: 'Lunch is served, Ravi. Enjoy your meal with family and take a peaceful rest.',
  },
  {
    id: 'rem-6',
    patientId: 'patient-ravi-001',
    title: 'Afternoon Hydration & Courtyard Stretch',
    type: 'HYDRATION',
    scheduledTime: '03:30 PM',
    timeOfDay: 'AFTERNOON',
    dosageOrInstruction: 'Drink a glass of water or fresh lime water; gentle 5-minute garden walk',
    status: 'PENDING',
    voicePromptText: 'Afternoon refreshment time! Drink a cup of water and take a gentle stroll in the courtyard.',
  },
  {
    id: 'rem-7',
    patientId: 'patient-ravi-001',
    title: 'Family Reminiscence & Photo Album Time',
    type: 'ACTIVITY',
    scheduledTime: '05:00 PM',
    timeOfDay: 'EVENING',
    dosageOrInstruction: 'Browse Tezpur and Shillong family memories album with your daughter Priyanka',
    status: 'PENDING',
    voicePromptText: 'Let us look at your lovely family photo memories and cherish happy times together.',
  },
  {
    id: 'rem-8',
    patientId: 'patient-ravi-001',
    title: 'Sundowning Calming Flute & Warm Lights',
    type: 'ROUTINE',
    scheduledTime: '06:30 PM',
    timeOfDay: 'EVENING',
    dosageOrInstruction: 'Turn on warm ambient lighting and listen to 10 minutes of peaceful flute melody to soothe the mind',
    status: 'PENDING',
    voicePromptText: 'The evening sunset is here. Let us listen to soothing flute music and relax peacefully.',
  },
  {
    id: 'rem-9',
    patientId: 'patient-ravi-001',
    title: 'Evening Dinner Tablet with Warm Water',
    type: 'MEDICATION',
    scheduledTime: '08:15 PM',
    timeOfDay: 'EVENING',
    dosageOrInstruction: '1 evening tablet after dinner with warm water',
    status: 'PENDING',
    voicePromptText: 'Ravi, dinner time is complete. Please take your evening tablet with warm water.',
  },
  {
    id: 'rem-10',
    patientId: 'patient-ravi-001',
    title: 'Bedtime Routine & Night Safety Check',
    type: 'ROUTINE',
    scheduledTime: '09:30 PM',
    timeOfDay: 'NIGHT',
    dosageOrInstruction: 'Warm cup of turmeric milk, bathroom check, soft nightlight on for safe peaceful sleep',
    status: 'PENDING',
    voicePromptText: 'Time to prepare for a restful sleep. Drink warm milk, check the nightlight, and sleep peacefully.',
  },
];

export const INITIAL_INSTRUCTIONS: CaregiverInstruction[] = [
  {
    id: 'inst-1',
    patientId: 'patient-ravi-001',
    authorName: 'Priyanka Kumar (Daughter)',
    rawInstructionText: 'He loves traditional Bihu flute music. Prefer engaging memory activities in the morning when he is freshest, and keep evening activities gentle.',
    structuredRule: {
      preferredTheme: 'Traditional Folk Music & Farming',
      timeOfDayPreference: 'MORNING',
      maxDifficulty: 3,
      enableRelaxationAudio: true,
      toneStyle: 'WARM_ENCOURAGING',
    },
    appliedStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiInterpretationNotes: 'Adapted daily schedule to prioritize memory card matching at 10 AM and soothing folk audio in the late afternoon.',
  }
];

export const INITIAL_OBSERVATIONS: AIObservation[] = [
  {
    id: 'obs-1',
    patientId: 'patient-ravi-001',
    category: 'PATTERN_ACTIVITY',
    title: 'Strong Geometric & Weave Pattern Recognition',
    observation: 'Ravi demonstrated 88% accuracy on Gamosa weave and sequence completion tasks with quick response times (under 2.4s).',
    explainabilityReason: 'Calculated from the last 4 pattern gaming sessions. Performance is +14% above personal baseline.',
    dataSources: ['GameSession: pattern-gamosa-04', 'GameSession: sequence-bead-02'],
    confidenceScore: 0.92,
    priority: 'INFO',
    isClinicalDiagnosis: false,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    metricsComparison: {
      metricName: 'Pattern Accuracy',
      recentValue: '88%',
      baselineValue: '74%',
      deviation: '+14% improvement',
    }
  },
  {
    id: 'obs-2',
    patientId: 'patient-ravi-001',
    category: 'MEMORY_ACTIVITY',
    title: 'Slightly Extended Response Latency on Name Recall',
    observation: 'Response latency in delayed name matching was 4.1s (normal baseline ~3.0s). The patient maintained cheerful engagement and completed all rounds.',
    explainabilityReason: 'Calculated by comparing session response time metrics against the established 14-day rolling average.',
    dataSources: ['GameSession: memory-family-03'],
    confidenceScore: 0.85,
    priority: 'LOW',
    isClinicalDiagnosis: false,
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    metricsComparison: {
      metricName: 'Name Recall Latency',
      recentValue: '4.1s',
      baselineValue: '3.0s',
      deviation: '+1.1s variance (Normal daily fluctuation)',
    }
  }
];

class LocalStorageEngine {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Network State Simulation for Offline-First Demonstrations
  public getNetworkState(): 'ONLINE' | 'OFFLINE' | 'LOW_CONNECTIVITY' {
    if (!this.isBrowser()) return 'ONLINE';
    const state = localStorage.getItem(STORAGE_KEYS.NETWORK_SIMULATION);
    return (state as 'ONLINE' | 'OFFLINE' | 'LOW_CONNECTIVITY') || 'ONLINE';
  }

  public setNetworkState(state: 'ONLINE' | 'OFFLINE' | 'LOW_CONNECTIVITY'): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.NETWORK_SIMULATION, state);
  }

  // Session Auth Management
  public getLoggedInSession(): { role: UserRole | null; patientId: string | null } {
    if (!this.isBrowser()) return { role: null, patientId: null };
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_AUTH);
    if (!data) return { role: null, patientId: null };
    try {
      return JSON.parse(data);
    } catch {
      return { role: null, patientId: null };
    }
  }

  public setLoggedInSession(role: UserRole | null, patientId?: string | null): void {
    if (!this.isBrowser()) return;
    if (!role) {
      localStorage.removeItem(STORAGE_KEYS.SESSION_AUTH);
    } else {
      localStorage.setItem(STORAGE_KEYS.SESSION_AUTH, JSON.stringify({ role, patientId: patientId || null }));
      if (patientId) {
        this.setActivePatientId(patientId);
      }
    }
  }

  public clearSession(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.SESSION_AUTH);
  }

  // Multi-Patient Registry Management
  public getPatientRegistry(): PatientProfile[] {
    if (!this.isBrowser()) return DEFAULT_PATIENTS;
    const data = localStorage.getItem(STORAGE_KEYS.PATIENT_REGISTRY);
    if (!data) {
      this.savePatientRegistry(DEFAULT_PATIENTS);
      return DEFAULT_PATIENTS;
    }
    try {
      const list: PatientProfile[] = JSON.parse(data);
      if (!Array.isArray(list) || list.length === 0) {
        this.savePatientRegistry(DEFAULT_PATIENTS);
        return DEFAULT_PATIENTS;
      }
      return list;
    } catch {
      return DEFAULT_PATIENTS;
    }
  }

  public savePatientRegistry(patients: PatientProfile[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PATIENT_REGISTRY, JSON.stringify(patients));
  }

  public getActivePatientId(): string {
    if (!this.isBrowser()) return DEFAULT_PATIENT.id;
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT_ID);
    if (id) return id;
    return DEFAULT_PATIENT.id;
  }

  public setActivePatientId(id: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
    const match = this.getPatientRegistry().find((p) => p.id === id);
    if (match) {
      this.savePatientProfile(match);
    }
  }

  public getPatientById(id: string): PatientProfile | null {
    const list = this.getPatientRegistry();
    return list.find((p) => p.id === id) || null;
  }

  public registerOrUpdatePatient(profileData: Partial<PatientProfile> & { name: string; preferredLanguage?: any }): PatientProfile {
    const registry = this.getPatientRegistry();
    let patientId = profileData.id;

    if (!patientId) {
      // Check if existing by name
      const existing = registry.find((p) => p.name.trim().toLowerCase() === profileData.name.trim().toLowerCase());
      if (existing) {
        patientId = existing.id;
      } else {
        patientId = `patient-${profileData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
      }
    }

    const existingIndex = registry.findIndex((p) => p.id === patientId);
    let fullProfile: PatientProfile;

    if (existingIndex >= 0) {
      fullProfile = {
        ...registry[existingIndex],
        ...profileData,
        id: patientId,
        lastSyncTimestamp: new Date().toISOString(),
      };
      registry[existingIndex] = fullProfile;
    } else {
      fullProfile = {
        id: patientId,
        name: profileData.name.trim(),
        age: profileData.age || 70,
        gender: profileData.gender || 'OTHER',
        region: profileData.region || 'Assam (Guwahati)',
        preferredLanguage: profileData.preferredLanguage || 'en',
        culturalInterests: profileData.culturalInterests || [
          'Traditional Bihu & Flute Music',
          'Assam Tea Gardening & Farming',
          'Family & Village Festivals',
        ],
        medicalDataProvided: false,
        caregiverName: profileData.caregiverName || 'Family Caregiver',
        caregiverContact: profileData.caregiverContact || '+91 98000 00000',
        baseline: null,
        currentDifficultyLevel: 2,
        fatigueScore: 15,
        lastSyncTimestamp: new Date().toISOString(),
        syncStatus: 'SYNCED',
        avatarUrl:
          profileData.avatarUrl ||
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      };
      registry.push(fullProfile);
    }

    this.savePatientRegistry(registry);
    this.setActivePatientId(fullProfile.id);
    this.savePatientProfile(fullProfile);
    this.enqueueEvent('PROFILE_UPDATED', { profile: fullProfile }, fullProfile.id);
    return fullProfile;
  }

  // Patient Profile (Backward compatibility)
  public getPatientProfile(): PatientProfile {
    if (!this.isBrowser()) return DEFAULT_PATIENT;
    const activeId = this.getActivePatientId();
    const match = this.getPatientRegistry().find((p) => p.id === activeId);
    if (match) return match;

    const data = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
    if (!data) {
      this.savePatientProfile(DEFAULT_PATIENT);
      return DEFAULT_PATIENT;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_PATIENT;
    }
  }

  public savePatientProfile(profile: PatientProfile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(profile));
    // Also sync back to registry
    const registry = this.getPatientRegistry();
    const idx = registry.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      registry[idx] = profile;
    } else {
      registry.push(profile);
    }
    this.savePatientRegistry(registry);
  }

  public updatePatientDifficulty(patientId: string, newLevel: number): void {
    const profile = this.getPatientProfile();
    if (profile.id === patientId || !patientId) {
      profile.currentDifficultyLevel = newLevel;
      this.savePatientProfile(profile);
    }
  }

  // Sync Queue
  public getSyncQueue(): SyncEvent[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public enqueueEvent(eventType: SyncEvent['eventType'], payload: Record<string, unknown>, patientId: string = 'patient-ravi-001'): SyncEvent {
    const queue = this.getSyncQueue();
    const newEvent: SyncEvent = {
      eventId: 'evt-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now(),
      patientId,
      eventType,
      timestamp: new Date().toISOString(),
      payload,
      syncStatus: this.getNetworkState() === 'ONLINE' ? 'SYNCED' : 'PENDING',
      retryCount: 0,
      version: 1,
    };

    queue.push(newEvent);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    }
    return newEvent;
  }

  public markEventsSynced(eventIds: string[]): void {
    if (!this.isBrowser()) return;
    const queue = this.getSyncQueue();
    const updated = queue.map(e => eventIds.includes(e.eventId) ? { ...e, syncStatus: 'SYNCED' as const } : e);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updated));
  }

  public clearSyncedQueue(): void {
    if (!this.isBrowser()) return;
    const queue = this.getSyncQueue();
    const pendingOnly = queue.filter(e => e.syncStatus !== 'SYNCED');
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(pendingOnly));
  }

  // Game Sessions
  public getGameSessions(patientId?: string): GameSessionResult[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
    if (!data) return [];
    try {
      const all: GameSessionResult[] = JSON.parse(data);
      return patientId ? all.filter(s => s.patientId === patientId) : all;
    } catch {
      return [];
    }
  }

  public saveGameSession(session: GameSessionResult): void {
    const sessions = this.getGameSessions();
    sessions.unshift(session);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(sessions));
    }
    // Enqueue event
    this.enqueueEvent('GAME_COMPLETED', { ...session }, session.patientId);
  }

  public addGameSession(session: GameSessionResult): void {
    this.saveGameSession(session);
  }

  // Memories
  public getMemories(): MemoryItem[] {
    if (!this.isBrowser()) return INITIAL_MEMORIES;
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_MEMORIES);
    if (!data) {
      this.saveMemories(INITIAL_MEMORIES);
      return INITIAL_MEMORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MEMORIES;
    }
  }

  public saveMemories(memories: MemoryItem[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.LOCAL_MEMORIES, JSON.stringify(memories));
  }

  public addMemory(memory: MemoryItem): void {
    const list = this.getMemories();
    list.unshift(memory);
    this.saveMemories(list);
  }

  // Reminders
  public getReminders(): ReminderItem[] {
    if (!this.isBrowser()) return INITIAL_REMINDERS;
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_REMINDERS);
    if (!data) {
      this.saveReminders(INITIAL_REMINDERS);
      return INITIAL_REMINDERS;
    }
    try {
      const parsed: ReminderItem[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= 6) {
        return parsed;
      }
      // Upgrade older sparse list to full dementia routine
      this.saveReminders(INITIAL_REMINDERS);
      return INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  }

  public saveReminders(reminders: ReminderItem[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.LOCAL_REMINDERS, JSON.stringify(reminders));
  }

  public addReminder(item: ReminderItem): void {
    const list = this.getReminders();
    list.push(item);
    this.saveReminders(list);
  }

  public updateReminder(updated: ReminderItem): void {
    const list = this.getReminders();
    const index = list.findIndex(r => r.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    this.saveReminders(list);
    if (updated.status === 'ACKNOWLEDGED') {
      this.enqueueEvent('REMINDER_ACKNOWLEDGED', { reminderId: updated.id, title: updated.title });
    }
  }

  public deleteReminder(id: string): void {
    const list = this.getReminders().filter(r => r.id !== id);
    this.saveReminders(list);
  }

  public resetRemindersToDefault(): ReminderItem[] {
    this.saveReminders(INITIAL_REMINDERS);
    return INITIAL_REMINDERS;
  }

  public updateReminderStatus(id: string, status: ReminderItem['status']): void {
    const list = this.getReminders();
    const updated = list.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          acknowledgedAt: status === 'ACKNOWLEDGED' ? new Date().toISOString() : r.acknowledgedAt,
        };
      }
      return r;
    });
    this.saveReminders(updated);

    if (status === 'ACKNOWLEDGED') {
      this.enqueueEvent('REMINDER_ACKNOWLEDGED', { reminderId: id });
    } else if (status === 'SKIPPED') {
      this.enqueueEvent('REMINDER_SKIPPED', { reminderId: id });
    }
  }

  // Caregiver Instructions
  public getCaregiverInstructions(): CaregiverInstruction[] {
    if (!this.isBrowser()) return INITIAL_INSTRUCTIONS;
    const data = localStorage.getItem(STORAGE_KEYS.CAREGIVER_INSTRUCTIONS);
    if (!data) {
      this.saveCaregiverInstructions(INITIAL_INSTRUCTIONS);
      return INITIAL_INSTRUCTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_INSTRUCTIONS;
    }
  }

  public saveCaregiverInstructions(instructions: CaregiverInstruction[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_INSTRUCTIONS, JSON.stringify(instructions));
  }

  public addCaregiverInstruction(inst: CaregiverInstruction): void {
    const list = this.getCaregiverInstructions();
    list.unshift(inst);
    this.saveCaregiverInstructions(list);
    this.enqueueEvent('CAREGIVER_INSTRUCTION_ADDED', { ...inst });
  }

  // AI Observations
  public getAIObservations(): AIObservation[] {
    if (!this.isBrowser()) return INITIAL_OBSERVATIONS;
    const data = localStorage.getItem(STORAGE_KEYS.AI_OBSERVATIONS);
    if (!data) {
      this.saveAIObservations(INITIAL_OBSERVATIONS);
      return INITIAL_OBSERVATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_OBSERVATIONS;
    }
  }

  public getObservations(): AIObservation[] {
    return this.getAIObservations();
  }

  public saveAIObservations(observations: AIObservation[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.AI_OBSERVATIONS, JSON.stringify(observations));
  }

  public getPendingSyncCount(): number {
    return this.getSyncQueue().filter(e => e.syncStatus === 'PENDING').length;
  }

  public getPendingEvents(): SyncEvent[] {
    return this.getSyncQueue().filter(e => e.syncStatus === 'PENDING');
  }

  public saveCaregiverInstruction(inst: CaregiverInstruction): void {
    this.addCaregiverInstruction(inst);
  }

  public saveMemory(memory: MemoryItem): void {
    const list = this.getMemories();
    const existingIdx = list.findIndex(m => m.id === memory.id);
    if (existingIdx >= 0) {
      list[existingIdx] = memory;
      this.saveMemories(list);
    } else {
      this.addMemory(memory);
    }
  }

  public resetToDemo(): void {
    this.resetToDemoData();
  }

  // Reset to initial demo state
  public resetToDemoData(): void {
    if (!this.isBrowser()) return;
    this.savePatientRegistry(DEFAULT_PATIENTS);
    this.setActivePatientId(DEFAULT_PATIENTS[0].id);
    this.savePatientProfile(DEFAULT_PATIENTS[0]);
    this.saveMemories(INITIAL_MEMORIES);
    this.saveReminders(INITIAL_REMINDERS);
    this.saveCaregiverInstructions(INITIAL_INSTRUCTIONS);
    this.saveAIObservations(INITIAL_OBSERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.GAME_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.SESSION_AUTH);
    this.setNetworkState('ONLINE');
  }
}

export const localDB = new LocalStorageEngine();
