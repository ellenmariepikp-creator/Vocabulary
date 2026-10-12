import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, RotateCcw, Sparkles, HelpCircle, Shuffle, CheckCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, GradeLevel } from '../types';
import { playLetterClick, playSuccess, playIncorrect, playCelebration, speakWord } from '../utils/audio';

interface WordScrambleGameProps {
  words: WordItem[];
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number, wordId?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface Tile {
  id: string;
  char: string;
  originalIndex: number;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  words,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
  onUnlockBadge,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const activePool = filteredWords.length > 0 ? filteredWords : words;

  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordItem>(activePool[0]);
  const [placedTiles, setPlacedTiles] = useState<(Tile | null)[]>([]);
  const [availableTiles, setAvailableTiles] = useState<Tile[]>([]);
  const [usedHint, setUsedHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showSyllables, setShowSyllables] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const initWord = (word: WordItem) => {
    setCurrentWord(word);
    setUsedHint(false);
    setSolved(false);
    setShowSyllables(false);

    const letters = word.word.toUpperCase().split('');
    const emptySlots = new Array(letters.length).fill(null);
    setPlacedTiles(emptySlots);

    // Shuffle tiles
    const tiles: Tile[] = letters.map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
      originalIndex: index,
    }));

    // Ensure it's not identical to answer
    let shuffled = [...tiles].sort(() => Math.random() - 0.5);
    if (shuffled.map(t => t.char).join('') === word.word.toUpperCase()) {
      shuffled = shuffled.reverse();
    }
    setAvailableTiles(shuffled);

    if (soundEnabled) {
      setTimeout(() => speakWord(word.word), 300);
    }
  };

  useEffect(() => {
    initWord(activePool[wordIndex % activePool.length]);
  }, [wordIndex, currentGrade]);

  // Click available tile to place in first open slot
  const handleSelectAvailable = (tile: Tile) => {
    playLetterClick(soundEnabled);
    const firstEmptyIndex = placedTiles.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return;

    const newPlaced = [...placedTiles];
    newPlaced[firstEmptyIndex] = tile;
    setPlacedTiles(newPlaced);

    setAvailableTiles(prev => prev.filter(t => t.id !== tile.id));

    // Check if fully placed
    checkWord(newPlaced);
  };

  // Click placed tile to remove back to available
  const handleRemovePlaced = (slotIndex: number) => {
    const tile = placedTiles[slotIndex];
    if (!tile) return;

    playLetterClick(soundEnabled);
    const newPlaced = [...placedTiles];
    newPlaced[slotIndex] = null;
    setPlacedTiles(newPlaced);

    setAvailableTiles(prev => [...prev, tile]);
  };

  // Check if current placed tiles match target word
  const checkWord = (slots: (Tile | null)[]) => {
    if (slots.some(s => s === null)) return;

    const spelled = slots.map(s => s!.char).join('');
    const target = currentWord.word.toUpperCase();

    if (spelled === target) {
      playSuccess(soundEnabled);
      setSolved(true);
      const earned = usedHint ? 2 : 5;
      onAwardStars(earned, currentWord.id);

      if (!usedHint) {
        onUnlockBadge('badge-scramble-ace');
      }

      setTotalCompleted(prev => {
        const next = prev + 1;
        if (next >= 5) {
          setRoundCompleted(true);
          playCelebration(soundEnabled);
          onAwardStars(15);
          confetti({ particleCount: 70, spread: 60 });
        }
        return next;
      });
    } else {
      playIncorrect(soundEnabled);
    }
  };

  // Hint: places the next correct letter in place
  const handleUseHint = () => {
    setUsedHint(true);
    const target = currentWord.word.toUpperCase();
    const firstMismatch = placedTiles.findIndex((tile, idx) => {
      return !tile || tile.char !== target[idx];
    });

    if (firstMismatch !== -1) {
      const correctChar = target[firstMismatch];
      // If a tile is currently occupying that slot, return it
      if (placedTiles[firstMismatch]) {
        const wrongTile = placedTiles[firstMismatch]!;
        setAvailableTiles(prev => [...prev, wrongTile]);
      }

      // Find tile with correctChar from available
      const foundIdx = availableTiles.findIndex(t => t.char === correctChar);
      if (foundIdx !== -1) {
        const correctTile = availableTiles[foundIdx];
        const newAvailable = [...availableTiles];
        newAvailable.splice(foundIdx, 1);
        setAvailableTiles(newAvailable);

        const newPlaced = [...placedTiles];
        newPlaced[firstMismatch] = correctTile;
        setPlacedTiles(newPlaced);
        playLetterClick(soundEnabled);
        checkWord(newPlaced);
      }
    }
  };

  const handleShuffleRemaining = () => {
    playLetterClick(soundEnabled);
    setAvailableTiles(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleNextWord = () => {
    setWordIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <span className="text-slate-500">Solved: <strong className="text-amber-700">{totalCompleted} / 5</strong></span>
        </div>
      </div>

      {!roundCompleted ? (
        <div className="space-y-6">
          {/* Target Clue Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              Unscramble the Letter Tiles!
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-3xl">{currentWord.emoji}</span>
              <button
                onClick={() => speakWord(currentWord.word)}
                title="Pronounce Word"
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meaning Clue */}
            <div className="mt-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-100 max-w-xl mx-auto">
              <p className="text-base sm:text-lg font-bold text-amber-950">
                "{currentWord.simpleDefinition}"
              </p>
              <p className="text-xs text-amber-800/80 mt-1 italic">
                Example: {currentWord.exampleSentence}
              </p>
            </div>

            {/* Syllables Toggle */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setShowSyllables(!showSyllables)}
                className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
              >
                {showSyllables ? 'Hide Syllable Breakdown' : 'Show Syllables (Phonics Hint)'}
              </button>
              {showSyllables && (
                <div className="flex gap-1 ml-2">
                  {currentWord.syllables.map((syl, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-md font-mono text-xs font-bold">
                      {syl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Placed Target Slots */}
          <div className="bg-slate-100/90 rounded-3xl p-6 border border-slate-200 shadow-inner flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[96px]">
            {placedTiles.map((tile, idx) => (
              <button
                key={idx}
                onClick={() => handleRemovePlaced(idx)}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-display font-extrabold transition-all cursor-pointer ${
                  tile
                    ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600 scale-100 hover:scale-95'
                    : 'bg-white border-2 border-dashed border-slate-300 text-transparent'
                }`}
              >
                {tile ? tile.char : ''}
              </button>
            ))}
          </div>

          {/* Solved Success Banner or Available Tile Pool */}
          {solved ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center shadow-md space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-800 text-xl font-display font-bold">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                Terrific Spelling! You mastered "{currentWord.word.toUpperCase()}"!
              </div>
              <p className="text-xs text-emerald-700">
                Earned <span className="font-bold">+5 Star Coins</span> for your pet companion!
              </p>
              <button
                onClick={handleNextWord}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next Word Challenge →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tap letters to place in order
              </div>

              {/* Available Letters Pool */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
                {availableTiles.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => handleSelectAvailable(tile)}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-display text-xl sm:text-2xl font-extrabold shadow-sm hover:scale-105 hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
                  >
                    {tile.char}
                  </button>
                ))}
              </div>

              {/* Action Utilities (Hint & Shuffle) */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleShuffleRemaining}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Shuffle Tiles
                </button>

                <button
                  onClick={handleUseHint}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Reveal Next Letter Hint
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Round Victory Card */
        <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center shadow-xl space-y-6 max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🏆</div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Scramble Architect Master!
            </h2>
            <p className="text-slate-600 text-sm">
              You unscrambled 5 vocabulary words with flying colors!
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-xs text-amber-800 font-semibold">Reward Awarded</div>
            <div className="text-3xl font-extrabold text-amber-950 font-mono mt-1">+15 ⭐</div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setTotalCompleted(0);
                setRoundCompleted(false);
                setWordIndex(prev => prev + 1);
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Next Set of Words
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
