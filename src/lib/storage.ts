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
  // 1. Ravi Kumar (Assam)
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

  // 2. Maya Devi (Meghalaya)
  {
    id: 'mem-maya-1',
    patientId: 'patient-maya-002',
    title: 'Ward’s Lake Morning Garden Walk',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    caption: 'Walking across the wooden bridge surrounded by blooming cherry blossoms in Shillong',
    fullStory: 'Maya loved morning walks around Ward’s Lake with her son Anil. The crisp hill air and pine scents always brought peace and joy. You fed the ducks together and enjoyed warm tea at the lakeside cafe.',
    peopleTagged: ['Maya Devi', 'Anil Devi (Son)'],
    relationship: 'Family Excursion',
    location: 'Shillong, Meghalaya',
    eventDateOrYear: 'March 2023',
    culturalTags: ['Shillong', 'Wards Lake', 'Pine Trees', 'Gardening'],
    verifiedByCaregiver: true,
    isFavorite: true,
    createdDate: '2023-03-20',
  },
  {
    id: 'mem-maya-2',
    patientId: 'patient-maya-002',
    title: 'Traditional Khasi Handloom Weaving',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    caption: 'Handweaving intricate traditional geometric shawls on the wooden porch loom',
    fullStory: 'Maya has been an artisan weaver for over 40 years. Her mastery of natural dyes and floral motifs is cherished across the village. She taught her daughter-in-law the heritage diamond warp technique.',
    peopleTagged: ['Maya Devi', 'Daughter-in-law Sunita'],
    relationship: 'Cultural Craft',
    location: 'Smit Village, Meghalaya',
    eventDateOrYear: 'October 2022',
    culturalTags: ['Weaving', 'Khasi Heritage', 'Handloom', 'Silk'],
    verifiedByCaregiver: true,
    isFavorite: true,
    createdDate: '2022-10-10',
  },

  // 3. Biren Barua (Jorhat, Assam)
  {
    id: 'mem-biren-1',
    patientId: 'patient-biren-003',
    title: 'Jorhat Tea Estate Morning Plucking',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    caption: 'Inspecting fresh golden two-leaves-and-a-bud harvest at sunrise in Jorhat',
    fullStory: 'Biren spent 35 years managing the heritage tea gardens of Jorhat. His knowledge of monsoon rains, soil scents, and tea processing is extraordinary. He loved walking along the misty rows every sunrise.',
    peopleTagged: ['Biren Barua', 'Mridul Barua (Son)'],
    relationship: 'Career & Life',
    location: 'Jorhat Tea Estate, Assam',
    eventDateOrYear: 'August 2021',
    culturalTags: ['Tea Gardens', 'Jorhat', 'Sunrise', 'Heritage'],
    verifiedByCaregiver: true,
    isFavorite: true,
    createdDate: '2021-08-18',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  // Ravi Kumar Reminders
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

  // Maya Devi Reminders
  {
    id: 'rem-maya-1',
    patientId: 'patient-maya-002',
    title: 'Morning Pine Hill Balcony Air & Warm Water',
    type: 'HYDRATION',
    scheduledTime: '07:00 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: 'Drink 1 glass of warm lemon water and enjoy fresh Shillong morning breeze',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    voicePromptText: 'Khublei Maya! Please drink your morning warm water and enjoy the peaceful hills.',
  },
  {
    id: 'rem-maya-2',
    patientId: 'patient-maya-002',
    title: 'Morning Blood Pressure Tablet with Breakfast',
    type: 'MEDICATION',
    scheduledTime: '08:30 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: '1 tablet after breakfast with water',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    voicePromptText: 'Maya, time for your morning health tablet with fresh water.',
  },
  {
    id: 'rem-maya-3',
    patientId: 'patient-maya-002',
    title: 'Courtyard Weaving Patterns & Memory Exercise',
    type: 'ACTIVITY',
    scheduledTime: '10:30 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: '5-minute Level 3 pattern sequencing and floral memory game',
    status: 'PENDING',
    voicePromptText: 'Time for your morning pattern game and handloom exercises!',
  },

  // Biren Barua Reminders
  {
    id: 'rem-biren-1',
    patientId: 'patient-biren-003',
    title: 'Morning Warm Water & Balcony Sunlight',
    type: 'HYDRATION',
    scheduledTime: '07:15 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: 'Drink 1 glass warm water and view garden plants',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    voicePromptText: 'Biren koka, please have a refreshing glass of warm water.',
  },
  {
    id: 'rem-biren-2',
    patientId: 'patient-biren-003',
    title: 'Morning Memory & Heart Tablet',
    type: 'MEDICATION',
    scheduledTime: '08:00 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: '1 tablet after morning tea',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    voicePromptText: 'Time for your morning tablet with water after tea.',
  },
  {
    id: 'rem-biren-3',
    patientId: 'patient-biren-003',
    title: 'Tea Garden Memory Match & Story',
    type: 'ACTIVITY',
    scheduledTime: '10:00 AM',
    timeOfDay: 'MORNING',
    dosageOrInstruction: 'Gentle 5-minute tea card matching and audio recall',
    status: 'PENDING',
    voicePromptText: 'Time for a peaceful 5-minute memory game with tea garden cards.',
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
  },
  {
    id: 'inst-maya-1',
    patientId: 'patient-maya-002',
    authorName: 'Anil Devi (Son)',
    rawInstructionText: 'She excels at intricate weaving patterns and floral designs. Suggest Level 3 pattern sequencing in the morning and soothing choral hymns at sunset.',
    structuredRule: {
      preferredTheme: 'Traditional Handloom Weaving & Flora',
      timeOfDayPreference: 'MORNING',
      maxDifficulty: 4,
      enableRelaxationAudio: true,
      toneStyle: 'WARM_ENCOURAGING',
    },
    appliedStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    aiInterpretationNotes: 'Set active difficulty level to 3 with Khasi handloom theme prioritization.',
  },
  {
    id: 'inst-biren-1',
    patientId: 'patient-biren-003',
    authorName: 'Mridul Barua (Son)',
    rawInstructionText: 'Prefers Assamese audio cueing. Keep cognitive activities under 10 minutes to avoid afternoon mental fatigue.',
    structuredRule: {
      preferredTheme: 'Jorhat Tea Estate & Folk Stories',
      timeOfDayPreference: 'MORNING',
      maxDifficulty: 2,
      enableRelaxationAudio: true,
      toneStyle: 'WARM_ENCOURAGING',
    },
    appliedStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    aiInterpretationNotes: 'Difficulty capped at Level 2 with enhanced audio assistance.',
  },
];

export const INITIAL_OBSERVATIONS: AIObservation[] = [
  // Ravi Kumar
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
  },

  // Maya Devi
  {
    id: 'obs-maya-1',
    patientId: 'patient-maya-002',
    category: 'PATTERN_ACTIVITY',
    title: 'High Precision on Geometric Weaving Sequence',
    observation: 'Maya achieved 94% accuracy on Level 3 pattern sequencing with rapid 2.4s response times.',
    explainabilityReason: 'Strong cognitive retention in spatial and visual domain linked to long-term artisan craft experience.',
    dataSources: ['GameSession: pattern-khasi-01', 'GameSession: pattern-khasi-02'],
    confidenceScore: 0.95,
    priority: 'INFO',
    isClinicalDiagnosis: false,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    metricsComparison: {
      metricName: 'Pattern Accuracy',
      recentValue: '94%',
      baselineValue: '88%',
      deviation: '+6% above baseline',
    }
  },

  // Biren Barua
  {
    id: 'obs-biren-1',
    patientId: 'patient-biren-003',
    category: 'MEMORY_ACTIVITY',
    title: 'Stable Response Latency on Historical Tea Garden Cards',
    observation: 'Biren demonstrated 72% accuracy on tea heritage matching with consistent focus and zero signs of agitation.',
    explainabilityReason: 'Engaging autobiographical memories provides grounding and lowers cognitive fatigue.',
    dataSources: ['GameSession: memory-tea-01'],
    confidenceScore: 0.88,
    priority: 'INFO',
    isClinicalDiagnosis: false,
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    metricsComparison: {
      metricName: 'Memory Recall',
      recentValue: '72%',
      baselineValue: '65%',
      deviation: '+7% improvement',
    }
  }
];

export const INITIAL_GAME_SESSIONS: GameSessionResult[] = [
  // Ravi Kumar Sessions
  {
    sessionId: 'sess-ravi-01',
    patientId: 'patient-ravi-001',
    gameId: 'Pattern Weave Match',
    category: 'PATTERN',
    difficulty: 2,
    score: 88,
    accuracyPercent: 88,
    avgResponseTimeMs: 2400,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Excellent precision on regional weave completion',
    fatigueObserved: 12,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    sessionId: 'sess-ravi-02',
    patientId: 'patient-ravi-001',
    gameId: 'Cultural Card Memory',
    category: 'MEMORY',
    difficulty: 2,
    score: 82,
    accuracyPercent: 82,
    avgResponseTimeMs: 3100,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Strong recognition of family and nature cards',
    fatigueObserved: 18,
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    sessionId: 'sess-ravi-03',
    patientId: 'patient-ravi-001',
    gameId: 'Bihu Rhythm Sequence',
    category: 'ROUTINE',
    difficulty: 2,
    score: 90,
    accuracyPercent: 90,
    avgResponseTimeMs: 2200,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Fluid rhythm following and cheerful engagement',
    fatigueObserved: 10,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },

  // Maya Devi Sessions
  {
    sessionId: 'sess-maya-01',
    patientId: 'patient-maya-002',
    gameId: 'Pine Hill Flora Match',
    category: 'MEMORY',
    difficulty: 3,
    score: 92,
    accuracyPercent: 92,
    avgResponseTimeMs: 2600,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Rapid and accurate botanical card recall',
    fatigueObserved: 8,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    sessionId: 'sess-maya-02',
    patientId: 'patient-maya-002',
    gameId: 'Khasi Weaving Pattern',
    category: 'PATTERN',
    difficulty: 3,
    score: 94,
    accuracyPercent: 94,
    avgResponseTimeMs: 2400,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Outstanding geometric handloom sequencing',
    fatigueObserved: 10,
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
  },

  // Biren Barua Sessions
  {
    sessionId: 'sess-biren-01',
    patientId: 'patient-biren-003',
    gameId: 'Tea Garden Object Sort',
    category: 'ATTENTION',
    difficulty: 2,
    score: 72,
    accuracyPercent: 72,
    avgResponseTimeMs: 3600,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Steady attention sustained throughout the sorting task',
    fatigueObserved: 22,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    sessionId: 'sess-biren-02',
    patientId: 'patient-biren-003',
    gameId: 'Kaziranga Wildlife Match',
    category: 'MEMORY',
    difficulty: 2,
    score: 68,
    accuracyPercent: 68,
    avgResponseTimeMs: 3900,
    totalAttempts: 1,
    completed: true,
    abandoned: false,
    feedbackText: 'Enjoyed animal imagery with calm pace',
    fatigueObserved: 26,
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
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
    if (!this.isBrowser()) {
      return patientId ? INITIAL_GAME_SESSIONS.filter(s => s.patientId === patientId) : INITIAL_GAME_SESSIONS;
    }
    const data = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
    let all: GameSessionResult[];
    if (!data) {
      this.saveInitialGameSessions();
      all = INITIAL_GAME_SESSIONS;
    } else {
      try {
        all = JSON.parse(data);
        if (!Array.isArray(all) || all.length === 0) {
          this.saveInitialGameSessions();
          all = INITIAL_GAME_SESSIONS;
        }
      } catch {
        all = INITIAL_GAME_SESSIONS;
      }
    }

    if (!patientId) return all;
    const match = all.filter(s => s.patientId === patientId);
    if (match.length > 0) return match;

    // Fallback: Generate calibrated sessions for newly created patients based on their baseline
    const patient = this.getPatientById(patientId);
    const baseScore = patient?.baseline?.memoryScore || 78;
    const baseLatency = patient?.baseline?.responseSpeedMs || 2800;
    return [
      {
        sessionId: `sess-${patientId}-01`,
        patientId,
        gameId: 'Cultural Card Memory',
        category: 'MEMORY',
        difficulty: patient?.currentDifficultyLevel || 2,
        score: baseScore,
        accuracyPercent: baseScore,
        avgResponseTimeMs: baseLatency,
        totalAttempts: 1,
        completed: true,
        abandoned: false,
        feedbackText: 'Steady memory recall pace',
        fatigueObserved: 10,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        sessionId: `sess-${patientId}-02`,
        patientId,
        gameId: 'Pattern Weave Match',
        category: 'PATTERN',
        difficulty: patient?.currentDifficultyLevel || 2,
        score: Math.min(100, baseScore + 6),
        accuracyPercent: Math.min(100, baseScore + 6),
        avgResponseTimeMs: Math.max(1800, baseLatency - 400),
        totalAttempts: 1,
        completed: true,
        abandoned: false,
        feedbackText: 'Strong visual sequencing',
        fatigueObserved: 12,
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
    ];
  }

  private saveInitialGameSessions(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(INITIAL_GAME_SESSIONS));
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
  public getMemories(patientId?: string): MemoryItem[] {
    let all: MemoryItem[];
    if (!this.isBrowser()) {
      all = INITIAL_MEMORIES;
    } else {
      const data = localStorage.getItem(STORAGE_KEYS.LOCAL_MEMORIES);
      if (!data) {
        this.saveMemories(INITIAL_MEMORIES);
        all = INITIAL_MEMORIES;
      } else {
        try {
          all = JSON.parse(data);
          if (!Array.isArray(all) || all.length === 0) {
            this.saveMemories(INITIAL_MEMORIES);
            all = INITIAL_MEMORIES;
          }
        } catch {
          all = INITIAL_MEMORIES;
        }
      }
    }

    if (!patientId) return all;
    const match = all.filter((m) => m.patientId === patientId);
    if (match.length > 0) return match;

    // Fallback starting memory for newly registered patient
    const p = this.getPatientById(patientId);
    return [
      {
        id: `mem-${patientId}-init`,
        patientId,
        title: `${p?.region.split(' ')[0] || 'Home'} Family Gathering`,
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        caption: `Cherished family moments in ${p?.region || 'North East India'}`,
        fullStory: `A serene memory celebrating with loved ones in ${p?.region || 'your hometown'}. Family smiles, warm tea, and joyful conversations.`,
        peopleTagged: [p?.name || 'Elder', p?.caregiverName || 'Family'],
        relationship: 'Family',
        location: p?.region || 'North East India',
        eventDateOrYear: '2023',
        culturalTags: ['Family', 'Heritage', 'Celebration'],
        verifiedByCaregiver: true,
        isFavorite: true,
        createdDate: new Date().toISOString().split('T')[0],
      },
    ];
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
  public getReminders(patientId?: string): ReminderItem[] {
    let all: ReminderItem[];
    if (!this.isBrowser()) {
      all = INITIAL_REMINDERS;
    } else {
      const data = localStorage.getItem(STORAGE_KEYS.LOCAL_REMINDERS);
      if (!data) {
        this.saveReminders(INITIAL_REMINDERS);
        all = INITIAL_REMINDERS;
      } else {
        try {
          const parsed: ReminderItem[] = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            all = parsed;
          } else {
            this.saveReminders(INITIAL_REMINDERS);
            all = INITIAL_REMINDERS;
          }
        } catch {
          all = INITIAL_REMINDERS;
        }
      }
    }

    if (!patientId) return all;
    const match = all.filter((r) => r.patientId === patientId);
    if (match.length > 0) return match;

    // Generate tailored reminders for new patient
    const p = this.getPatientById(patientId);
    const firstName = p?.name.split(' ')[0] || 'Dear friend';
    return [
      {
        id: `rem-${patientId}-1`,
        patientId,
        title: 'Morning Hydration & Sunlight',
        type: 'HYDRATION',
        scheduledTime: '07:30 AM',
        timeOfDay: 'MORNING',
        dosageOrInstruction: 'Drink 1 glass of fresh water and enjoy the morning garden air',
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        voicePromptText: `Good morning ${firstName}! Please drink a cup of fresh water.`,
      },
      {
        id: `rem-${patientId}-2`,
        patientId,
        title: 'Morning Health Tablet & Breakfast',
        type: 'MEDICATION',
        scheduledTime: '08:30 AM',
        timeOfDay: 'MORNING',
        dosageOrInstruction: '1 tablet after breakfast with warm water',
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        voicePromptText: `${firstName}, time for your morning health tablet with water.`,
      },
      {
        id: `rem-${patientId}-3`,
        patientId,
        title: 'Morning 5-Minute Memory Card Puzzle',
        type: 'ACTIVITY',
        scheduledTime: '10:00 AM',
        timeOfDay: 'MORNING',
        dosageOrInstruction: 'Engage with daily cultural card matching',
        status: 'PENDING',
        voicePromptText: `Time for your fun morning memory matching game!`,
      },
      {
        id: `rem-${patientId}-4`,
        patientId,
        title: 'Mid-Day Lunch & Quiet Rest',
        type: 'ROUTINE',
        scheduledTime: '01:00 PM',
        timeOfDay: 'AFTERNOON',
        dosageOrInstruction: 'Enjoy a warm balanced meal followed by a peaceful afternoon rest',
        status: 'PENDING',
        voicePromptText: `Lunch is ready, ${firstName}. Enjoy your meal with family.`,
      },
    ];
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
      this.enqueueEvent('REMINDER_ACKNOWLEDGED', { reminderId: updated.id, title: updated.title }, updated.patientId);
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
    let targetPatientId = 'patient-ravi-001';
    const updated = list.map(r => {
      if (r.id === id) {
        targetPatientId = r.patientId;
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
      this.enqueueEvent('REMINDER_ACKNOWLEDGED', { reminderId: id }, targetPatientId);
    } else if (status === 'SKIPPED') {
      this.enqueueEvent('REMINDER_SKIPPED', { reminderId: id }, targetPatientId);
    }
  }

  // Caregiver Instructions
  public getCaregiverInstructions(patientId?: string): CaregiverInstruction[] {
    let all: CaregiverInstruction[];
    if (!this.isBrowser()) {
      all = INITIAL_INSTRUCTIONS;
    } else {
      const data = localStorage.getItem(STORAGE_KEYS.CAREGIVER_INSTRUCTIONS);
      if (!data) {
        this.saveCaregiverInstructions(INITIAL_INSTRUCTIONS);
        all = INITIAL_INSTRUCTIONS;
      } else {
        try {
          all = JSON.parse(data);
          if (!Array.isArray(all) || all.length === 0) {
            this.saveCaregiverInstructions(INITIAL_INSTRUCTIONS);
            all = INITIAL_INSTRUCTIONS;
          }
        } catch {
          all = INITIAL_INSTRUCTIONS;
        }
      }
    }

    if (!patientId) return all;
    return all.filter((i) => i.patientId === patientId);
  }

  public saveCaregiverInstructions(instructions: CaregiverInstruction[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_INSTRUCTIONS, JSON.stringify(instructions));
  }

  public addCaregiverInstruction(inst: CaregiverInstruction): void {
    const list = this.getCaregiverInstructions();
    list.unshift(inst);
    this.saveCaregiverInstructions(list);
    this.enqueueEvent('CAREGIVER_INSTRUCTION_ADDED', { ...inst }, inst.patientId);
  }

  // AI Observations
  public getAIObservations(patientId?: string): AIObservation[] {
    let all: AIObservation[];
    if (!this.isBrowser()) {
      all = INITIAL_OBSERVATIONS;
    } else {
      const data = localStorage.getItem(STORAGE_KEYS.AI_OBSERVATIONS);
      if (!data) {
        this.saveAIObservations(INITIAL_OBSERVATIONS);
        all = INITIAL_OBSERVATIONS;
      } else {
        try {
          all = JSON.parse(data);
          if (!Array.isArray(all) || all.length === 0) {
            this.saveAIObservations(INITIAL_OBSERVATIONS);
            all = INITIAL_OBSERVATIONS;
          }
        } catch {
          all = INITIAL_OBSERVATIONS;
        }
      }
    }

    if (!patientId) return all;
    const match = all.filter((o) => o.patientId === patientId);
    if (match.length > 0) return match;

    // Generate observations based on the specific patient's baseline
    const p = this.getPatientById(patientId);
    const patScore = p?.baseline?.patternScore || 80;
    const memScore = p?.baseline?.memoryScore || 75;
    const latSec = p?.baseline?.responseSpeedMs ? (p.baseline.responseSpeedMs / 1000).toFixed(1) : '3.0';

    return [
      {
        id: `obs-${patientId}-1`,
        patientId,
        category: 'PATTERN_ACTIVITY',
        title: `Consistent Focus on ${p?.region.split(' ')[0] || 'Regional'} Cultural Matching`,
        observation: `${p?.name || 'Patient'} showed ${patScore}% accuracy on visual pattern activities with an average response speed of ${latSec}s.`,
        explainabilityReason: `Calculated from calibrated baseline telemetry metrics.`,
        dataSources: [`GameSession: init-${patientId}`],
        confidenceScore: 0.90,
        priority: 'INFO',
        isClinicalDiagnosis: false,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        metricsComparison: {
          metricName: 'Pattern Accuracy',
          recentValue: `${patScore}%`,
          baselineValue: `${patScore - 5}%`,
          deviation: '+5% positive engagement',
        },
      },
      {
        id: `obs-${patientId}-2`,
        patientId,
        category: 'MEMORY_ACTIVITY',
        title: `Steady Delayed Recall Performance`,
        observation: `${p?.name || 'Patient'} completed memory recall challenges with ${memScore}% retention and zero distress.`,
        explainabilityReason: `Autobiographical grounding in familiar culture supports steady recall.`,
        dataSources: [`GameSession: memory-${patientId}`],
        confidenceScore: 0.86,
        priority: 'INFO',
        isClinicalDiagnosis: false,
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        metricsComparison: {
          metricName: 'Memory Recall',
          recentValue: `${memScore}%`,
          baselineValue: `${memScore}%`,
          deviation: 'Stable baseline adherence',
        },
      },
    ];
  }

  public getObservations(patientId?: string): AIObservation[] {
    return this.getAIObservations(patientId);
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
