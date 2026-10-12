import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { BubblePopGame } from './components/BubblePopGame';
import { WordScrambleGame } from './components/WordScrambleGame';
import { MysteryRiddleGame } from './components/MysteryRiddleGame';
import { SafariMatchGame } from './components/SafariMatchGame';
import { StoryWeaver } from './components/StoryWeaver';
import { SentenceBuilder } from './components/SentenceBuilder';
import { PetCloset } from './components/PetCloset';
import { WordBank } from './components/WordBank';
import { CustomWordWorkshop } from './components/CustomWordWorkshop';
import { WordDetailModal } from './components/WordDetailModal';
import { ActiveScreen, GameStats, GradeLevel, WordItem, HatItem } from './types';
import { INITIAL_WORDS, COMPANION_PETS, ACCESSORY_HATS, INITIAL_BADGES } from './data/words';
import { loadGameStats, saveGameStats, loadCustomWords, saveCustomWords } from './utils/storage';
import { playSuccess, playCelebration } from './utils/audio';
import confetti from 'canvas-confetti';

export default function App() {
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());
  const [customWords, setCustomWords] = useState<WordItem[]>(() => loadCustomWords());
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('grade_3_4');
  const [inspectingWord, setInspectingWord] = useState<WordItem | null>(null);
  const [unlockedToast, setUnlockedToast] = useState<{ title: string; icon: string } | null>(null);

  // Sync stats to localStorage
  useEffect(() => {
    saveGameStats(stats);
  }, [stats]);

  // Sync custom words
  useEffect(() => {
    saveCustomWords(customWords);
  }, [customWords]);

  const allWords = [...INITIAL_WORDS, ...customWords];

  const currentPet =
    COMPANION_PETS.find((p) => p.id === stats.selectedPetId) || COMPANION_PETS[0];

  // Award stars and optionally mark word mastered
  const handleAwardStars = (amount: number, wordId?: string) => {
    setStats((prev) => {
      let nextMastered = [...prev.wordsMastered];
      if (wordId && !nextMastered.includes(wordId)) {
        nextMastered.push(wordId);
      }

      let nextBadges = [...prev.unlockedBadges];
      // Mastery badge check
      if (nextMastered.length >= 10 && !nextBadges.includes('badge-vocab-titan')) {
        nextBadges.push('badge-vocab-titan');
        showBadgeUnlock('Vocabulary Champ', '🏆');
      }

      return {
        ...prev,
        totalStars: prev.totalStars + amount,
        wordsMastered: nextMastered,
        unlockedBadges: nextBadges,
      };
    });
  };

  const handleUnlockBadge = (badgeId: string) => {
    setStats((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      const found = INITIAL_BADGES.find((b) => b.id === badgeId);
      if (found) {
        showBadgeUnlock(found.name, found.icon);
      }
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  };

  const showBadgeUnlock = (title: string, icon: string) => {
    playCelebration(stats.soundEnabled);
    confetti({ particleCount: 60, spread: 70 });
    setUnlockedToast({ title, icon });
    setTimeout(() => setUnlockedToast(null), 4000);
  };

  const handleToggleSound = () => {
    setStats((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const handleSelectPet = (petId: string) => {
    setStats((prev) => ({
      ...prev,
      selectedPetId: petId,
    }));
  };

  const handleEquipHat = (hatId: string) => {
    setStats((prev) => {
      let badges = [...prev.unlockedBadges];
      if (hatId !== 'hat-none' && !badges.includes('badge-stylist')) {
        badges.push('badge-stylist');
        showBadgeUnlock('Pet Fashionista', '🎩');
      }
      return {
        ...prev,
        equippedHatId: hatId,
        unlockedBadges: badges,
      };
    });
  };

  const handleBuyHat = (hat: HatItem) => {
    setStats((prev) => {
      if (prev.totalStars < hat.cost) return prev;
      return {
        ...prev,
        totalStars: prev.totalStars - hat.cost,
        unlockedHats: [...prev.unlockedHats, hat.id],
        equippedHatId: hat.id,
      };
    });
  };

  const handleToggleMastered = (wordId: string) => {
    setStats((prev) => {
      const exists = prev.wordsMastered.includes(wordId);
      const next = exists
        ? prev.wordsMastered.filter((id) => id !== wordId)
        : [...prev.wordsMastered, wordId];
      return { ...prev, wordsMastered: next };
    });
  };

  const handleAddCustomWord = (word: WordItem) => {
    setCustomWords((prev) => [word, ...prev]);
  };

  const handleRemoveCustomWord = (id: string) => {
    setCustomWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handlePlayWithWord = (word: WordItem, game: 'bubble_pop' | 'word_scramble' | 'sentence_builder') => {
    setCurrentGrade(word.gradeLevel);
    setActiveScreen(game);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopNav
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        stats={stats}
        currentPet={currentPet}
        onToggleSound={handleToggleSound}
      />

      {/* Badge Unlock Celebration Toast */}
      {unlockedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3 animate-bounce">
          <span className="text-3xl">{unlockedToast.icon}</span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Badge Unlocked!
            </div>
            <div className="font-display font-extrabold text-sm sm:text-base">
              {unlockedToast.title}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeScreen === 'dashboard' && (
          <Dashboard
            stats={stats}
            currentPet={currentPet}
            words={allWords}
            currentGrade={currentGrade}
            setCurrentGrade={setCurrentGrade}
            setActiveScreen={setActiveScreen}
            onOpenWordModal={(w) => setInspectingWord(w)}
          />
        )}

        {activeScreen === 'bubble_pop' && (
          <BubblePopGame
            words={allWords}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={handleAwardStars}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeScreen === 'word_scramble' && (
          <WordScrambleGame
            words={allWords}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={handleAwardStars}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeScreen === 'mystery_riddle' && (
          <MysteryRiddleGame
            words={allWords}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={handleAwardStars}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeScreen === 'safari_match' && (
          <SafariMatchGame
            words={allWords}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={handleAwardStars}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeScreen === 'story_weaver' && (
          <StoryWeaver
            words={allWords}
            currentPet={currentPet}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={(amt) => handleAwardStars(amt)}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeScreen === 'sentence_builder' && (
          <SentenceBuilder
            words={allWords}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onAwardStars={handleAwardStars}
          />
        )}

        {activeScreen === 'pet_closet' && (
          <PetCloset
            stats={stats}
            currentPet={currentPet}
            onSelectPet={handleSelectPet}
            onEquipHat={handleEquipHat}
            onBuyHat={handleBuyHat}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            soundEnabled={stats.soundEnabled}
          />
        )}

        {activeScreen === 'word_bank' && (
          <WordBank
            words={allWords}
            stats={stats}
            currentGrade={currentGrade}
            soundEnabled={stats.soundEnabled}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            onToggleMastered={handleToggleMastered}
            onSelectWord={(w) => setInspectingWord(w)}
          />
        )}

        {activeScreen === 'custom_words' && (
          <CustomWordWorkshop
            customWords={customWords}
            onAddCustomWord={handleAddCustomWord}
            onRemoveCustomWord={handleRemoveCustomWord}
            onBackToDashboard={() => setActiveScreen('dashboard')}
            soundEnabled={stats.soundEnabled}
          />
        )}
      </main>

      {/* Inspect Word Modal */}
      {inspectingWord && (
        <WordDetailModal
          word={inspectingWord}
          onClose={() => setInspectingWord(null)}
          isMastered={stats.wordsMastered.includes(inspectingWord.id)}
          onToggleMastered={handleToggleMastered}
          onPlayWithWord={handlePlayWithWord}
        />
      )}

      {/* Footer conforming to quiet anti-slop rules */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display font-semibold text-slate-700">
            <span>🌟</span> VocabQuest Academy · Primary School Learning Adventures
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Grades 1 to 6 Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Phonics & Games</span>
            <span aria-hidden="true">·</span>
            <span>Audio Pronunciation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
