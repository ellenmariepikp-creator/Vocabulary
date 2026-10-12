import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RotateCcw, Sparkles, Trophy, Zap, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, GradeLevel } from '../types';
import { playPop, playSuccess, playIncorrect, playCelebration, speakWord } from '../utils/audio';

interface BubblePopGameProps {
  words: WordItem[];
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number, wordId?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface BubbleOption {
  text: string;
  isCorrect: boolean;
  color: string;
}

const BUBBLE_COLORS = [
  'from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 border-sky-300 text-white',
  'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-amber-300 text-white',
  'from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 border-emerald-300 text-white',
  'from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 border-purple-300 text-white',
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  words,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
  onUnlockBadge,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const activePool = filteredWords.length >= 4 ? filteredWords : words;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordItem>(activePool[0]);
  const [bubbles, setBubbles] = useState<BubbleOption[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [roundFinished, setRoundFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [totalRounds, setTotalRounds] = useState(5);
  const [roundCount, setRoundCount] = useState(1);

  // Setup round
  const setupRound = (index: number) => {
    const target = activePool[index % activePool.length];
    setCurrentWord(target);
    setPoppedBubbles([]);
    setFeedback(null);

    // Pick 3 distractors
    const distractors = activePool
      .filter(w => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.simpleDefinition);

    // Combine and shuffle
    const options: BubbleOption[] = [
      { text: target.simpleDefinition, isCorrect: true, color: BUBBLE_COLORS[0] },
      ...distractors.map((text, idx) => ({
        text,
        isCorrect: false,
        color: BUBBLE_COLORS[(idx + 1) % BUBBLE_COLORS.length],
      })),
    ].sort(() => Math.random() - 0.5);

    setBubbles(options);

    // Pronounce target word
    if (soundEnabled) {
      setTimeout(() => speakWord(target.word), 250);
    }
  };

  useEffect(() => {
    setupRound(0);
  }, [currentGrade]);

  const handleBubbleClick = (index: number, option: BubbleOption) => {
    if (poppedBubbles.includes(index) || roundFinished || feedback) return;

    playPop(soundEnabled);
    setPoppedBubbles(prev => [...prev, index]);

    if (option.isCorrect) {
      playSuccess(soundEnabled);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 + newStreak * 2;
      setScore(prev => prev + points);

      if (newStreak >= 5) {
        onUnlockBadge('badge-bubble-pop');
      }

      setFeedback({
        text: `Spot on! "${currentWord.word}" means ${currentWord.simpleDefinition}`,
        correct: true,
      });

      onAwardStars(3, currentWord.id);

      setTimeout(() => {
        if (roundCount >= totalRounds) {
          // Finish round
          setRoundFinished(true);
          playCelebration(soundEnabled);
          onAwardStars(10);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          setRoundCount(prev => prev + 1);
          setCurrentIndex(prev => prev + 1);
          setupRound(currentIndex + 1);
        }
      }, 1500);
    } else {
      playIncorrect(soundEnabled);
      setStreak(0);
      setFeedback({
        text: `Oops, not quite! Try another bubble!`,
        correct: false,
      });
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setRoundCount(1);
    setCurrentIndex(0);
    setRoundFinished(false);
    setupRound(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Controls & Status Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>

        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Round:</span>
            <span className="font-bold text-slate-800">{roundCount} / {totalRounds}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-bold text-amber-700">Streak: {streak}x</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span className="font-bold text-orange-700">Score: {score}</span>
          </div>
        </div>
      </div>

      {!roundFinished ? (
        <div className="space-y-6">
          {/* Target Word Display Card */}
          <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-sky-200 rounded-3xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
              Pop the matching definition bubble!
            </div>

            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-4xl">{currentWord.emoji}</span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {currentWord.word}
              </h2>
              <button
                onClick={() => speakWord(currentWord.word)}
                title="Pronounce Word"
                className="p-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mt-2">
              <span className="font-mono">{currentWord.phonetic}</span>
              <span>·</span>
              <span className="italic font-medium">{currentWord.partOfSpeech}</span>
              <span>·</span>
              <span>{currentWord.category}</span>
            </div>

            {/* Hint / Example Sentence */}
            <div className="mt-4 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto bg-white/80 p-2.5 rounded-xl border border-sky-100">
              <span className="font-semibold text-sky-800">Sentence Clue:</span> "{currentWord.exampleSentence}"
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {feedback.correct ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              {feedback.text}
            </div>
          )}

          {/* Floating Bubble Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {bubbles.map((bubble, idx) => {
              const isPopped = poppedBubbles.includes(idx);
              return (
                <button
                  key={idx}
                  disabled={isPopped}
                  onClick={() => handleBubbleClick(idx, bubble)}
                  className={`relative p-6 rounded-3xl border-2 shadow-md transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                    isPopped
                      ? 'opacity-20 scale-95 pointer-events-none'
                      : `bg-gradient-to-r ${bubble.color} hover:scale-102 hover:shadow-lg animate-float`
                  }`}
                  style={{ animationDelay: `${idx * 0.4}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-sm font-extrabold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm sm:text-base font-bold leading-snug drop-shadow-xs">
                      {bubble.text}
                    </span>
                  </div>

                  <span className="text-2xl ml-2 opacity-80">🫧</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Summary Modal Card */
        <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center shadow-xl space-y-6 max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🏆</div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Quest Complete!
            </h2>
            <p className="text-slate-600 text-sm">
              You popped through all vocabulary definitions with lightning speed!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-4 bg-amber-50 rounded-2xl border border-amber-200/80">
            <div>
              <div className="text-xs text-amber-800 font-semibold">Total Points</div>
              <div className="text-2xl font-extrabold text-amber-950 font-mono">{score}</div>
            </div>
            <div>
              <div className="text-xs text-amber-800 font-semibold">Bonus Stars</div>
              <div className="text-2xl font-extrabold text-orange-600 font-mono">+10 ⭐</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>

            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer"
            >
              Back to Island
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
