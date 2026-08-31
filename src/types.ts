export type UserRole = 'PATIENT' | 'CAREGIVER' | 'HEALTHCARE_WORKER' | 'ADMIN';

export type SupportedLanguage = 'en' | 'as' | 'bn' | 'mni' | 'kha' | 'lus' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
}

export interface CognitiveBaseline {
  memoryScore: number; // 0 - 100
  attentionScore: number; // 0 - 100
  recallScore: number; // 0 - 100
  patternScore: number; // 0 - 100
  responseSpeedMs: number;
  engagementLevel: 'HIGH' | 'MODERATE' | 'LOW';
  completedAt: string;
  isInitialBaseline: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  region: string; // e.g. "Assam (Guwahati)", "Meghalaya (Shillong)", "Manipur (Imphal)"
  preferredLanguage: SupportedLanguage;
  culturalInterests: string[]; // ["Traditional Folk Music", "Bihu & Tea Gardening", "Weaving & Silk", "Cooking Assamese Dishes", "Nature & Wildlife"]
  medicalDataProvided: boolean;
  medicalConditions?: string[];
  allergies?: string[];
  medicationsSummary?: string[];
  caregiverName: string;
  caregiverContact: string;
  baseline: CognitiveBaseline | null;
  currentDifficultyLevel: number; // 1 to 5
  fatigueScore: number; // 0 - 100
  lastSyncTimestamp: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'OFFLINE';
  avatarUrl: string;
}

export type GameCategory =
  | 'MEMORY'
  | 'ATTENTION'
  | 'PATTERN'
  | 'ROUTINE'
  | 'RELAX'
  | 'LANGUAGE'
  | 'SPATIAL'
  | 'STORY';

export interface GameItem {
  id: string;
  name: string;
  category: GameCategory;
  description: string;
  iconName: string;
  culturalTheme: string;
  targetCognitiveDomain: string;
  baseDifficulty: number;
}

export interface GameSessionResult {
  sessionId: string;
  patientId: string;
  gameId: string;
  category: GameCategory;
  difficulty: number;
  score: number; // 0 - 100
  accuracyPercent: number;
  avgResponseTimeMs: number;
  totalAttempts: number;
  completed: boolean;
  abandoned: boolean;
  timestamp: string;
  feedbackText: string;
  fatigueObserved?: number;
  adaptationApplied?: {
    previousDifficulty: number;
    newDifficulty: number;
    reason: string;
  };
}

export interface MemoryItem {
  id: string;
  patientId: string;
  title: string;
  imageUrl: string;
  caption: string;
  fullStory: string;
  peopleTagged: string[];
  relationship: string;
  location: string;
  eventDateOrYear: string;
  culturalTags: string[];
  verifiedByCaregiver: boolean;
  isFavorite: boolean;
  audioNarrationUrl?: string;
  createdDate: string;
}

export type ReminderType = 'MEDICATION' | 'HYDRATION' | 'ACTIVITY' | 'APPOINTMENT' | 'ROUTINE';
export type ReminderStatus = 'PENDING' | 'ACKNOWLEDGED' | 'SNOOZED' | 'SKIPPED';

export interface ReminderItem {
  id: string;
  patientId: string;
  title: string;
  type: ReminderType;
  scheduledTime: string; // e.g. "08:00 AM"
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  dosageOrInstruction?: string;
  status: ReminderStatus;
  acknowledgedAt?: string;
  voicePromptText: string;
}

export type ObservationPriority = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
export type ObservationCategory = 
  | 'ENGAGEMENT'
  | 'MEMORY_ACTIVITY'
  | 'ATTENTION_ACTIVITY'
  | 'PATTERN_ACTIVITY'
  | 'ROUTINE'
  | 'REMINDER_INTERACTION'
  | 'VOICE_INTERACTION'
  | 'SYSTEM_STATUS';

export interface AIObservation {
  id: string;
  patientId: string;
  category: ObservationCategory;
  title: string;
  observation: string;
  explainabilityReason: string;
  dataSources: string[];
  confidenceScore: number; // 0.0 - 1.0
  priority: ObservationPriority;
  isClinicalDiagnosis: false; // Safety invariant
  timestamp: string;
  metricsComparison?: {
    metricName: string;
    recentValue: string;
    baselineValue: string;
    deviation: string;
  };
}

export interface AdaptationOutput {
  calculatedDifficulty: number;
  difficultyChange: 'INCREASED' | 'DECREASED' | 'MAINTAINED';
  reason: string;
  suggestRest: boolean;
  recommendedCategory: GameCategory;
  themeContext: string;
}

export interface StructuredPreference {
  preferredTheme?: string;
  timeOfDayPreference?: 'MORNING' | 'AFTERNOON' | 'EVENING';
  maxDifficulty?: number;
  minDifficulty?: number;
  hydrationPromptTime?: string;
  enableRelaxationAudio?: boolean;
  toneStyle?: 'WARM_ENCOURAGING' | 'GENTLE_MINIMAL' | 'STORYTELLER';
}

export interface CaregiverInstruction {
  id: string;
  patientId: string;
  caregiverId?: string;
  authorName?: string;
  rawInstructionText: string;
  structuredRule: StructuredPreference;
  appliedStatus: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  aiInterpretationNotes?: string;
}

export interface AIRecommendation {
  id: string;
  patientId: string;
  recommendedActivityTitle: string;
  category: GameCategory;
  difficulty: number;
  estimatedDurationMinutes: number;
  reasonExplanation: string;
  culturalContext: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'MODIFIED' | 'REJECTED';
  generatedAt: string;
}

export interface SyncEvent {
  eventId: string;
  patientId: string;
  eventType: 
    | 'GAME_COMPLETED'
    | 'MEMORY_VIEWED'
    | 'MEMORY_QUERY'
    | 'MEMORY_CREATED'
    | 'VOICE_INTERACTION'
    | 'REMINDER_ACKNOWLEDGED'
    | 'REMINDER_SKIPPED'
    | 'BASELINE_COMPLETED'
    | 'CAREGIVER_INSTRUCTION_ADDED'
    | 'PROFILE_UPDATED';
  timestamp: string;
  payload: Record<string, unknown>;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  version: number;
}

export interface PatientTimelineEvent {
  id: string;
  time: string;
  date: string;
  type: 'GAME' | 'REMINDER' | 'MEMORY' | 'VOICE' | 'OBSERVATION' | 'INSTRUCTION';
  title: string;
  detail: string;
  badgeText?: string;
  statusColor?: string;
}

export interface DailySummaryData {
  patientId: string;
  dateStr: string;
  activitiesCompletedCount: number;
  engagementRating: 'High' | 'Moderate' | 'Low';
  reminderAdherencePercent: number;
  strengths: string[];
  areasOfGentleFocus: string[];
  notableObservations: string;
  overallMoodIndicator: 'Cheerful & Engaged' | 'Calm & Restful' | 'Mildly Fatigued';
  safetyNote: string;
}

export interface WeeklyTrendData {
  patientId: string;
  weekRange: string;
  engagementTrend: 'UP' | 'STABLE' | 'DOWN';
  memoryTrend: 'UP' | 'STABLE' | 'DOWN';
  attentionTrend: 'UP' | 'STABLE' | 'DOWN';
  patternTrend: 'UP' | 'STABLE' | 'DOWN';
  reminderAdherenceAverage: number;
  dayByDayActivity: { day: string; games: number; reminders: number; voiceChats: number }[];
  summaryNarrative: string;
}
