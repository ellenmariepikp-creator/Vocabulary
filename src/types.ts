export type GradeLevel = 'grade_1_2' | 'grade_3_4' | 'grade_5_6';

export interface WordItem {
  id: string;
  word: string;
  simpleDefinition: string;
  fullDefinition: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  exampleSentence: string;
  phonetic: string;
  syllables: string[];
  synonyms: string[];
  category: string;
  gradeLevel: GradeLevel;
  emoji: string;
  mysteryClues: [string, string, string, string];
}

export interface CompanionPet {
  id: string;
  name: string;
  animal: string;
  emoji: string;
  title: string;
  color: string;
  accentColor: string;
  personality: string;
  favoriteWord: string;
}

export interface HatItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'speed' | 'streak' | 'mastery' | 'story' | 'explorer';
}

export interface GameStats {
  totalStars: number;
  coins: number;
  wordsMastered: string[];
  streakDays: number;
  lastPlayedDate: string;
  selectedPetId: string;
  equippedHatId: string;
  unlockedHats: string[];
  unlockedBadges: string[];
  dailyChallengeCompleted: boolean;
  soundEnabled: boolean;
}

export type ActiveScreen = 
  | 'dashboard' 
  | 'bubble_pop' 
  | 'word_scramble' 
  | 'mystery_riddle' 
  | 'safari_match' 
  | 'story_weaver' 
  | 'pet_closet' 
  | 'word_bank'
  | 'sentence_builder'
  | 'custom_words';
