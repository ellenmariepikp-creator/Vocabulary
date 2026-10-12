import React, { useState } from 'react';
import { ArrowLeft, Search, Volume2, CheckCircle2, Circle, Sparkles, Filter, BookOpen } from 'lucide-react';
import { WordItem, GradeLevel, GameStats } from '../types';
import { speakWord, playSuccess } from '../utils/audio';

interface WordBankProps {
  words: WordItem[];
  stats: GameStats;
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onToggleMastered: (wordId: string) => void;
  onSelectWord: (word: WordItem) => void;
}

export const WordBank: React.FC<WordBankProps> = ({
  words,
  stats,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onToggleMastered,
  onSelectWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');

  const filtered = words.filter((w) => {
    // Search
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.simpleDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Grade
    const matchesGrade = gradeFilter === 'all' || w.gradeLevel === gradeFilter;

    // Mastery
    const isMastered = stats.wordsMastered.includes(w.id);
    const matchesMastery =
      masteryFilter === 'all' ||
      (masteryFilter === 'mastered' && isMastered) ||
      (masteryFilter === 'unmastered' && !isMastered);

    return matchesSearch && matchesGrade && matchesMastery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800">
          <BookOpen className="w-4 h-4" /> Word Bank & Dictionary
        </div>
      </div>

      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Explorer Word Bank ({filtered.length} Words)
          </h2>
          <p className="text-xs text-slate-500">
            Listen to pronunciations, study syllables, and track your mastered words
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by word, meaning, or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Grade Selector */}
          <div className="sm:col-span-3">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Grades</option>
              <option value="grade_1_2">Grades 1-2 (Early)</option>
              <option value="grade_3_4">Grades 3-4 (Adventurers)</option>
              <option value="grade_5_6">Grades 5-6 (Masters)</option>
            </select>
          </div>

          {/* Mastery Selector */}
          <div className="sm:col-span-3">
            <select
              value={masteryFilter}
              onChange={(e) => setMasteryFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Mastery States</option>
              <option value="mastered">Mastered Only ⭐</option>
              <option value="unmastered">Still Practicing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Word Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((word) => {
          const isMastered = stats.wordsMastered.includes(word.id);
          return (
            <div
              key={word.id}
              onClick={() => onSelectWord(word)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isMastered
                  ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{word.emoji}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900 capitalize">
                        {word.word}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {word.phonetic}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(word.word);
                    }}
                    title="Pronounce Word"
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="italic font-medium">{word.partOfSpeech}</span>
                  <span>·</span>
                  <span>{word.category}</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                  "{word.simpleDefinition}"
                </p>

                <p className="mt-1.5 text-[11px] text-slate-500 italic">
                  Example: {word.exampleSentence}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {/* Syllables */}
                <div className="flex gap-1">
                  {word.syllables.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Mastered toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastered(word.id);
                    playSuccess(soundEnabled);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {isMastered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mastered
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-400" /> Mark Mastered
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
