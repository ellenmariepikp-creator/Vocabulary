import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Coins } from 'lucide-react';
import { ActiveScreen, GameStats, CompanionPet } from '../types';

interface TopNavProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  stats: GameStats;
  currentPet: CompanionPet;
  onToggleSound: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeScreen,
  setActiveScreen,
  stats,
  currentPet,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform hover:scale-102"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-xs">
            🌟
          </div>
          <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-700 via-orange-600 to-amber-900 bg-clip-text text-transparent">
            VocabQuest
          </span>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveScreen('dashboard')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'dashboard'
                ? 'text-amber-800 bg-amber-50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Quest Island
          </button>

          <button
            onClick={() => setActiveScreen('word_bank')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'word_bank'
                ? 'text-amber-800 bg-amber-50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Word Bank
          </button>

          <button
            onClick={() => setActiveScreen('pet_closet')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeScreen === 'pet_closet'
                ? 'text-amber-800 bg-amber-50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{currentPet.emoji}</span>
            <span>Pet Grove</span>
          </button>

          <button
            onClick={() => setActiveScreen('story_weaver')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'story_weaver'
                ? 'text-amber-800 bg-amber-50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Story Weaver
          </button>

          <button
            onClick={() => setActiveScreen('custom_words')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'custom_words'
                ? 'text-amber-800 bg-amber-50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Word Workshop
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day Streak */}
          <div 
            title={`${stats.streakDays} day quest streak!`}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-bold text-orange-700"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="tabular-nums">{stats.streakDays}</span>
          </div>

          {/* Stars & Coins */}
          <div 
            onClick={() => setActiveScreen('pet_closet')}
            title="Golden Stars earned! Click to visit Pet Grove Shop"
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="tabular-nums font-mono text-sm">{stats.totalStars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={stats.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={stats.soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
