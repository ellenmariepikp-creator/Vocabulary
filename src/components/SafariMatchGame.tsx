import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, Volume2, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, GradeLevel } from '../types';
import { playSuccess, playIncorrect, playLetterClick, playCelebration, speakWord } from '../utils/audio';

interface SafariMatchGameProps {
  words: WordItem[];
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number, wordId?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface MatchCard {
  id: string; // unique card id
  pairId: string; // word id
  type: 'word' | 'definition';
  content: string;
  emoji?: string;
  flipped: boolean;
  matched: boolean;
}

export const SafariMatchGame: React.FC<SafariMatchGameProps> = ({
  words,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
  onUnlockBadge,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const pool = filteredWords.length >= 4 ? filteredWords : words;

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    // Pick 4 random words for 8 cards
    const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);

    const generated: MatchCard[] = [];
    chosen.forEach(w => {
      // Word Card
      generated.push({
        id: `word-${w.id}`,
        pairId: w.id,
        type: 'word',
        content: w.word,
        emoji: w.emoji,
        flipped: false,
        matched: false,
      });
      // Definition Card
      generated.push({
        id: `def-${w.id}`,
        pairId: w.id,
        type: 'definition',
        content: w.simpleDefinition,
        flipped: false,
        matched: false,
      });
    });

    setCards(generated.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, [currentGrade]);

  const handleCardClick = (card: MatchCard) => {
    if (card.flipped || card.matched || selectedCards.length >= 2 || gameWon) return;

    playLetterClick(soundEnabled);
    if (card.type === 'word') {
      speakWord(card.content);
    }

    const flippedCard = { ...card, flipped: true };
    const nextCards = cards.map(c => (c.id === card.id ? flippedCard : c));
    setCards(nextCards);

    const nextSelected = [...selectedCards, flippedCard];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = nextSelected;

      if (first.pairId === second.pairId) {
        // MATCH!
        playSuccess(soundEnabled);
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.pairId === first.pairId ? { ...c, matched: true } : c))
          );
          setSelectedCards([]);
          setMatchedPairs(prev => {
            const updated = [...prev, first.pairId];
            onAwardStars(2, first.pairId);
            if (updated.length === 4) {
              setGameWon(true);
              playCelebration(soundEnabled);
              onAwardStars(10);
              confetti({ particleCount: 75, spread: 70 });
            }
            return updated;
          });
        }, 500);
      } else {
        // NO MATCH -> Flip back
        playIncorrect(soundEnabled);
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c))
          );
          setSelectedCards([]);
        }, 1100);
      }
    }
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

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <span className="text-slate-500">Pairs Found: <strong className="text-emerald-700">{matchedPairs.length} / 4</strong></span>
          <span className="text-slate-500">Moves: <strong className="text-slate-800">{moves}</strong></span>
        </div>
      </div>

      {!gameWon ? (
        <div className="space-y-4">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1">
              Flip & Match Pairs
            </span>
            <p className="text-xs text-slate-500">
              Match each vocabulary word with its matching kid-friendly meaning!
            </p>
          </div>

          {/* 8 Card Grid (4x2 on mobile, 4x2 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card) => {
              return (
                <button
                  key={card.id}
                  disabled={card.matched}
                  onClick={() => handleCardClick(card)}
                  className={`aspect-4/3 sm:aspect-square p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs ${
                    card.matched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-90 scale-98'
                      : card.flipped
                      ? 'bg-amber-50 border-amber-400 text-amber-950 scale-102 shadow-md'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-teal-400 text-white hover:scale-103'
                  }`}
                >
                  {card.flipped || card.matched ? (
                    <div className="space-y-1">
                      {card.emoji && <div className="text-2xl sm:text-3xl">{card.emoji}</div>}
                      <div className={`font-bold ${card.type === 'word' ? 'font-display text-lg sm:text-xl capitalize' : 'text-xs sm:text-sm'}`}>
                        {card.content}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        {card.type}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-3xl sm:text-4xl">🌿</span>
                      <div className="text-xs font-bold text-emerald-100 uppercase tracking-widest">
                        Safari Card
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center shadow-xl space-y-6 max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🏆</div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Safari Memory Champ!
            </h2>
            <p className="text-slate-600 text-sm">
              You linked all words to their meanings in only {moves} moves!
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs text-emerald-800 font-semibold">Reward Earned</div>
            <div className="text-3xl font-extrabold text-emerald-950 font-mono mt-1">+10 ⭐</div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={initGame}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Play Fresh Grid
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
