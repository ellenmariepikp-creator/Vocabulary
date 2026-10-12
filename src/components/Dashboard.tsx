import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  BookOpen, 
  HelpCircle, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Smile,
  Volume2
} from 'lucide-react';
import { ActiveScreen, GameStats, CompanionPet, WordItem, GradeLevel, Badge } from '../types';
import { INITIAL_BADGES, ACCESSORY_HATS } from '../data/words';
import { speakWord, playSuccess } from '../utils/audio';

interface DashboardProps {
  stats: GameStats;
  currentPet: CompanionPet;
  words: WordItem[];
  currentGrade: GradeLevel;
  setCurrentGrade: (grade: GradeLevel) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenWordModal: (word: WordItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  currentPet,
  words,
  currentGrade,
  setCurrentGrade,
  setActiveScreen,
  onOpenWordModal,
}) => {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const masteredCount = filteredWords.filter(w => stats.wordsMastered.includes(w.id)).length;
  const progressPercent = Math.min(100, Math.round((masteredCount / Math.max(1, filteredWords.length)) * 100));

  // Word of the day based on date
  const wordOfTheDay = filteredWords[0] || words[0];

  const equippedHat = ACCESSORY_HATS.find(h => h.id === stats.equippedHatId);

  const handleImgError = (key: string) => {
    setImageError(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/10">
        <div className="grid lg:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10 relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Primary School Vocabulary Adventure
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Embark on Your Magical Word Quest!
            </h1>
            
            <p className="text-amber-50 text-base sm:text-lg max-w-xl leading-relaxed">
              Solve playful puzzles, rescue words, power up your companion pet <span className="font-bold underline decoration-amber-300">{currentPet.name}</span>, and earn glowing Star Coins!
            </p>

            {/* Quick Action Button Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveScreen('bubble_pop')}
                className="px-6 py-3 bg-white text-orange-600 font-bold rounded-2xl hover:bg-amber-50 transition-all shadow-md hover:scale-102 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Bubble Pop
              </button>

              <button
                onClick={() => setActiveScreen('word_scramble')}
                className="px-5 py-3 bg-orange-700/60 hover:bg-orange-700/80 text-white font-bold rounded-2xl transition-all backdrop-blur-xs flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                🧩 Tile Scramble
              </button>

              <button
                onClick={() => setActiveScreen('mystery_riddle')}
                className="px-5 py-3 bg-amber-900/40 hover:bg-amber-900/60 text-white font-bold rounded-2xl transition-all backdrop-blur-xs flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                🕵️ Word Detective
              </button>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 group">
              {!imageError['hero'] ? (
                <img
                  src="/src/assets/images/vocab_adventure_hero_1791186866146.jpg"
                  alt="VocabQuest magical fantasy learning island"
                  referrerPolicy="no-referrer"
                  onError={() => handleImgError('hero')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-amber-400 to-orange-600 flex flex-col items-center justify-center p-6 text-center text-white">
                  <span className="text-6xl mb-3">🏝️</span>
                  <p className="font-display font-bold text-xl">Word Quest Kingdom</p>
                  <p className="text-xs text-amber-100 mt-1">Explore, Learn, and Level Up!</p>
                </div>
              )}

              {/* Floating Pet Card Tag */}
              <div 
                onClick={() => setActiveScreen('pet_closet')}
                className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-amber-100 flex items-center justify-between text-slate-800 cursor-pointer hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative text-3xl">
                    <span>{currentPet.emoji}</span>
                    {equippedHat && equippedHat.id !== 'hat-none' && (
                      <span className="absolute -top-3 -right-2 text-lg animate-bounce">
                        {equippedHat.emoji}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{currentPet.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Active Buddy</span>
                    </div>
                    <p className="text-xs text-slate-500">Tap to visit Pet Grove & Shop</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Level Selector */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Select Your Learning Level
            </h2>
            <p className="text-xs text-slate-500">
              Tailored curriculum matching your primary school class
            </p>
          </div>

          {/* Segmented Interactive Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setCurrentGrade('grade_1_2')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentGrade === 'grade_1_2'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⭐ Grades 1-2 (Early)
            </button>
            <button
              onClick={() => setCurrentGrade('grade_3_4')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentGrade === 'grade_3_4'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 Grades 3-4 (Adventures)
            </button>
            <button
              onClick={() => setCurrentGrade('grade_5_6')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentGrade === 'grade_5_6'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏆 Grades 5-6 (Mastery)
            </button>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="w-full sm:w-2/3 flex items-center gap-3">
            <span className="font-semibold text-slate-700 whitespace-nowrap">Level Mastery</span>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-amber-700 tabular-nums">{progressPercent}%</span>
          </div>
          <div className="text-slate-500 text-right w-full sm:w-auto">
            <span className="font-semibold text-slate-700">{masteredCount}</span> of {filteredWords.length} words mastered
          </div>
        </div>
      </section>

      {/* Featured Word of the Day + Pet Advice */}
      <section className="grid md:grid-cols-12 gap-6">
        {/* Word of the Day */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Word of the Day
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {wordOfTheDay.word}
                </h3>
                <span className="text-2xl">{wordOfTheDay.emoji}</span>
                <button
                  onClick={() => speakWord(wordOfTheDay.word)}
                  title="Listen to pronunciation"
                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="font-mono text-slate-600">{wordOfTheDay.phonetic}</span>
                <span>·</span>
                <span className="italic">{wordOfTheDay.partOfSpeech}</span>
                <span>·</span>
                <span>{wordOfTheDay.category}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenWordModal(wordOfTheDay)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Explore Word
            </button>
          </div>

          <div className="mt-4 p-3.5 bg-amber-50/70 rounded-xl border border-amber-100">
            <p className="text-sm font-medium text-amber-950">
              "{wordOfTheDay.simpleDefinition}"
            </p>
            <p className="text-xs text-amber-800/80 mt-1 italic">
              Example: {wordOfTheDay.exampleSentence}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Syllables:</span>
              <div className="flex gap-1">
                {wordOfTheDay.syllables.map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('sentence_builder')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              Write a sentence <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Companion Pet Message Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-orange-50 to-amber-100/70 rounded-2xl p-6 border border-orange-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="text-5xl shrink-0 p-2 bg-white rounded-2xl shadow-xs border border-orange-100">
              {currentPet.emoji}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-slate-900">{currentPet.name}</h4>
              </div>
              <p className="text-xs text-slate-600 italic">
                "{currentPet.personality}"
              </p>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-orange-200/60 shadow-2xs">
            <p className="text-xs text-slate-700 leading-relaxed">
              "Psst! Did you know? If you play <strong className="text-orange-700">Bubble Pop Blast</strong>, you can earn up to 10 golden stars in one round! Let's beat our high score!"
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">Favorite Word: <strong className="text-slate-800">{currentPet.favoriteWord}</strong></span>
            <button
              onClick={() => setActiveScreen('pet_closet')}
              className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Pet Wardrobe <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Gamified Challenges Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Interactive Challenge Arenas
            </h2>
            <p className="text-xs text-slate-500">
              Choose your quest to train memory, spelling, phonics, and definitions
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Game 1: Bubble Pop Blast */}
          <div
            onClick={() => setActiveScreen('bubble_pop')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🫧
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Bubble Pop Blast
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Floating bubbles hold definitions! Pop the bubble that matches the target word before time ticks away!
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
              <span>Speed & Definitions</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                +10 ⭐
              </span>
            </div>
          </div>

          {/* Game 2: Tile Scramble */}
          <div
            onClick={() => setActiveScreen('word_scramble')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧩
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Word Scramble
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Snap bouncy letter tiles in order! Listen to syllables and phonic hints to build the master word.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Spelling & Phonics</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                +10 ⭐
              </span>
            </div>
          </div>

          {/* Game 3: Mystery Detective */}
          <div
            onClick={() => setActiveScreen('mystery_riddle')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-400 to-indigo-500 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🕵️
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Mystery Detective
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unlock secret clues one by one. The fewer clues you need to solve the riddle, the bigger your bonus!
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Riddles & Logic</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                +15 ⭐
              </span>
            </div>
          </div>

          {/* Game 4: Safari Card Match */}
          <div
            onClick={() => setActiveScreen('safari_match')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎴
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Safari Card Match
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Flip memory cards to pair vocabulary words with their matching meanings and playful emojis!
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Memory & Pairs</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                +10 ⭐
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Zone: Story Weaver & Sentence Builder */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Story Weaver Card */}
        <div 
          onClick={() => setActiveScreen('story_weaver')}
          className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden cursor-pointer group"
        >
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Magical AI Story Generator
            </div>
            <h3 className="font-display text-2xl font-bold">
              Story Weaver Adventure
            </h3>
            <p className="text-violet-100 text-sm max-w-md leading-relaxed">
              Weave your mastered words into an illustrated adventure starring <strong className="text-white">{currentPet.name}</strong>, complete with reading questions and voice!
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-800 font-bold text-xs rounded-xl shadow-xs group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors">
                Launch Story Weaver <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 text-9xl opacity-20 group-hover:scale-110 transition-transform">
            📖
          </div>
        </div>

        {/* Sentence Lab Card */}
        <div 
          onClick={() => setActiveScreen('sentence_builder')}
          className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden cursor-pointer group"
        >
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <span>✍️</span>
              Creative Writing Arena
            </div>
            <h3 className="font-display text-2xl font-bold">
              Sentence Builder Lab
            </h3>
            <p className="text-teal-100 text-sm max-w-md leading-relaxed">
              Write your own cool sentence using today's words and receive cheerful instant feedback and extra Star Coins!
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-800 font-bold text-xs rounded-xl shadow-xs group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors">
                Write a Sentence <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 text-9xl opacity-20 group-hover:scale-110 transition-transform">
            🌟
          </div>
        </div>
      </section>

      {/* Badges & Trophy Showcase */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Trophy Cabinet & Badges
            </h3>
            <p className="text-xs text-slate-500">
              Unlock badges as you complete challenges and build learning streaks
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            {stats.unlockedBadges.length} / {INITIAL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                title={`${badge.name}: ${badge.description}`}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/60 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-[11px] font-bold truncate">{badge.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                  {isUnlocked ? 'Unlocked!' : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
