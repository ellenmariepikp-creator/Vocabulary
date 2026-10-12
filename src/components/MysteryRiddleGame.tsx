import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Eye, Sparkles, Volume2, Trophy, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, GradeLevel } from '../types';
import { playSuccess, playIncorrect, playLetterClick, playCelebration, speakWord } from '../utils/audio';

interface MysteryRiddleGameProps {
  words: WordItem[];
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number, wordId?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const MysteryRiddleGame: React.FC<MysteryRiddleGameProps> = ({
  words,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
  onUnlockBadge,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const pool = filteredWords.length >= 4 ? filteredWords : words;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordItem>(pool[0]);
  const [unlockedClues, setUnlockedClues] = useState<number>(1);
  const [suspects, setSuspects] = useState<WordItem[]>([]);
  const [typedGuess, setTypedGuess] = useState('');
  const [solved, setSolved] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const initCase = (index: number) => {
    const target = pool[index % pool.length];
    setCurrentWord(target);
    setUnlockedClues(1);
    setTypedGuess('');
    setSolved(false);
    setWrongGuess(false);

    // Pick 3 decoys for suspect line-up
    const decoys = pool
      .filter(w => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const lineup = [target, ...decoys].sort(() => Math.random() - 0.5);
    setSuspects(lineup);
  };

  useEffect(() => {
    initCase(currentIndex);
  }, [currentIndex, currentGrade]);

  const handleRevealNextClue = () => {
    if (unlockedClues < 4) {
      playLetterClick(soundEnabled);
      setUnlockedClues(prev => prev + 1);
    }
  };

  const handleVerifyGuess = (guessWord: string) => {
    if (solved) return;
    const cleanGuess = guessWord.trim().toLowerCase();
    const cleanTarget = currentWord.word.toLowerCase();

    if (cleanGuess === cleanTarget) {
      playSuccess(soundEnabled);
      setSolved(true);
      setWrongGuess(false);

      // Star calculation based on clues used
      let starReward = 15;
      if (unlockedClues === 2) starReward = 10;
      if (unlockedClues === 3) starReward = 6;
      if (unlockedClues === 4) starReward = 3;

      onAwardStars(starReward, currentWord.id);

      if (unlockedClues <= 2) {
        onUnlockBadge('badge-detective');
      }

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      playIncorrect(soundEnabled);
      setWrongGuess(true);
      setTimeout(() => setWrongGuess(false), 1200);
    }
  };

  const handleNextCase = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-purple-700">
          <Search className="w-4 h-4" /> Case #{currentIndex + 1}
        </div>
      </div>

      {/* Main Detective Clue Desk */}
      <div className="bg-white rounded-3xl border border-purple-200 shadow-md overflow-hidden">
        {/* Desk Header Banner */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Secret Word Dossier
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Crack the Mystery Word!
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm max-w-md">
              Unlock clues one by one. The fewer clues you inspect before solving, the more Detective Stars you pocket!
            </p>
          </div>

          <div className="w-36 h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            {!imgError ? (
              <img
                src="/src/assets/images/detective_mystery_board_1791186901426.jpg"
                alt="Detective Desk with magnifying glass"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-700 flex items-center justify-center text-4xl">
                🕵️
              </div>
            )}
          </div>
        </div>

        {/* Clue Unfolding Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🔍</span> Uncovered Clues ({unlockedClues} of 4)
              </h3>

              {unlockedClues < 4 && !solved && (
                <button
                  onClick={handleRevealNextClue}
                  className="px-4 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Reveal Clue #{unlockedClues + 1}
                </button>
              )}
            </div>

            <div className="grid gap-3">
              {currentWord.mysteryClues.map((clue, idx) => {
                const isUnlocked = idx < unlockedClues;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-purple-50/70 border-purple-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-200/80 text-purple-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="text-sm font-medium">
                        {isUnlocked ? (
                          <span>{clue}</span>
                        ) : (
                          <span className="italic font-normal">
                            🔒 Top secret clue locked. Click "Reveal" above if you need help!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solved Case Card or Suspect Lineup */}
          {solved ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center shadow-md space-y-4">
              <div className="text-5xl animate-bounce">{currentWord.emoji}</div>
              <h3 className="font-display text-3xl font-extrabold text-emerald-950">
                Case Solved: {currentWord.word.toUpperCase()}!
              </h3>
              <p className="text-emerald-800 text-sm max-w-md mx-auto">
                "{currentWord.simpleDefinition}"
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-4 h-4" /> Listen to Pronunciation
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleNextCase}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Investigate Next Case →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-base font-bold text-slate-800">
                  Suspect Line-Up (Choose the correct word):
                </h4>
                {wrongGuess && (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Not that one, try another suspect!
                  </span>
                )}
              </div>

              {/* Suspect Line-Up Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suspects.map((suspect) => (
                  <button
                    key={suspect.id}
                    onClick={() => handleVerifyGuess(suspect.word)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50 text-slate-900 font-display font-bold text-base shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">{suspect.emoji}</span>
                    <span className="capitalize">{suspect.word}</span>
                    <span className="text-[10px] text-slate-500 font-normal uppercase">{suspect.partOfSpeech}</span>
                  </button>
                ))}
              </div>

              {/* Or Type Your Guess */}
              <div className="pt-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (typedGuess) handleVerifyGuess(typedGuess);
                  }}
                  className="flex gap-2 max-w-md mx-auto"
                >
                  <input
                    type="text"
                    value={typedGuess}
                    onChange={(e) => setTypedGuess(e.target.value)}
                    placeholder="Or type the secret word..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Submit Guess
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
