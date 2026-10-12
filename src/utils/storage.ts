import { GameStats, WordItem } from '../types';
import { INITIAL_WORDS } from '../data/words';

const STORAGE_KEY = 'vocabquest_stats_v1';
const CUSTOM_WORDS_KEY = 'vocabquest_custom_words_v1';

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function loadGameStats(): GameStats {
  const defaultStats: GameStats = {
    totalStars: 25,
    coins: 50,
    wordsMastered: ['g1-curious'],
    streakDays: 1,
    lastPlayedDate: getTodayDateString(),
    selectedPetId: 'pet-fox',
    equippedHatId: 'hat-none',
    unlockedHats: ['hat-none'],
    unlockedBadges: ['badge-first-word'],
    dailyChallengeCompleted: false,
    soundEnabled: true,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed: GameStats = JSON.parse(raw);

    // Check streak logic based on dates
    const today = getTodayDateString();
    if (parsed.lastPlayedDate !== today) {
      const last = new Date(parsed.lastPlayedDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        // Continuous streak!
        parsed.streakDays += 1;
      } else if (diffDays > 1) {
        // Streak reset
        parsed.streakDays = 1;
      }
      parsed.lastPlayedDate = today;
      parsed.dailyChallengeCompleted = false; // Fresh daily challenge
      saveGameStats(parsed);
    }

    return { ...defaultStats, ...parsed };
  } catch (e) {
    return defaultStats;
  }
}

export function saveGameStats(stats: GameStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {}
}

export function loadCustomWords(): WordItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveCustomWords(words: WordItem[]) {
  try {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
  } catch (e) {}
}
