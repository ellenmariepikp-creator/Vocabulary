import React, { useState } from 'react';
import { ArrowLeft, Sparkles, BookOpen, Volume2, VolumeX, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, CompanionPet, GradeLevel } from '../types';
import { speakWord, playSuccess, playIncorrect, playCelebration } from '../utils/audio';

interface StoryWeaverProps {
  words: WordItem[];
  currentPet: CompanionPet;
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface StoryResult {
  title: string;
  story: string;
  highlightedWords: string[];
  question: string;
  options: string[];
  correctAnswer: string;
  moral: string;
}

export const StoryWeaver: React.FC<StoryWeaverProps> = ({
  words,
  currentPet,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
  onUnlockBadge,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const activePool = filteredWords.length >= 3 ? filteredWords : words;

  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([
    activePool[0]?.id || 'g1-curious',
    activePool[1]?.id || 'g1-glimmer',
  ]);

  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [readingAloud, setReadingAloud] = useState(false);

  const toggleSelectWord = (id: string) => {
    if (selectedWordIds.includes(id)) {
      if (selectedWordIds.length > 1) {
        setSelectedWordIds(prev => prev.filter(wId => wId !== id));
      }
    } else {
      if (selectedWordIds.length < 3) {
        setSelectedWordIds(prev => [...prev, id]);
      }
    }
  };

  const handleRandomizeWords = () => {
    const shuffled = [...activePool].sort(() => Math.random() - 0.5);
    setSelectedWordIds(shuffled.slice(0, 3).map(w => w.id));
  };

  const handleGenerateStory = async () => {
    setLoading(true);
    setStoryData(null);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);

    const chosenWords = words
      .filter(w => selectedWordIds.includes(w.id))
      .map(w => w.word);

    try {
      const response = await fetch('/api/gemini/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: chosenWords,
          petName: currentPet.name,
          petType: currentPet.animal,
          gradeLevel: currentGrade,
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data: StoryResult = await response.json();
      setStoryData(data);
      onUnlockBadge('badge-story-weaver');
      playSuccess(soundEnabled);
    } catch (err) {
      console.warn('Fallback to local story:', err);
      // Client-side fallback
      const fallback: StoryResult = {
        title: `${currentPet.name}'s Secret Forest Adventure`,
        story: `One sunny afternoon, ${currentPet.name} embarked on an exciting trail through the Whispering Woods. Feeling wonderfully ${chosenWords[0] || 'curious'}, they spotted hidden stones that began to ${chosenWords[1] || 'glimmer'} brightly along the bubbling stream! With a joyful leap, our brave buddy unlocked the ancient secret of the island.`,
        highlightedWords: chosenWords,
        question: `Where did ${currentPet.name} go on their trail?`,
        options: ['The Whispering Woods', 'A noisy subway station', 'A dusty attic'],
        correctAnswer: 'The Whispering Woods',
        moral: 'Curiosity and courage make every day a grand adventure!'
      };
      setStoryData(fallback);
      onUnlockBadge('badge-story-weaver');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = (option: string) => {
    if (!storyData || selectedAnswer) return;
    setSelectedAnswer(option);

    if (option === storyData.correctAnswer) {
      setIsAnswerCorrect(true);
      playSuccess(soundEnabled);
      playCelebration(soundEnabled);
      onAwardStars(10);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      setIsAnswerCorrect(false);
      playIncorrect(soundEnabled);
    }
  };

  const handleReadStory = () => {
    if (!storyData) return;
    setReadingAloud(true);
    speakWord(`${storyData.title}. ${storyData.story}`, 0.9, 1.05);
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

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-violet-700">
          <BookOpen className="w-4 h-4" /> AI Story Weaver
        </div>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Creative Story Lab
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Weave Your Words into an Adventure!
            </h2>
            <p className="text-violet-100 text-xs sm:text-sm max-w-lg">
              Pick 2 or 3 vocabulary words. Our magical story engine will weave them into an illustrated mini-tale starring <strong className="text-white underline">{currentPet.name}</strong>!
            </p>
          </div>

          <div className="text-6xl p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
            {currentPet.emoji}
          </div>
        </div>
      </div>

      {/* Word Selection Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Select 2 to 3 Words:
            </h3>
            <p className="text-xs text-slate-500">
              Tap words you'd like to see woven into your story
            </p>
          </div>

          <button
            onClick={handleRandomizeWords}
            className="text-xs font-bold text-violet-600 hover:text-violet-800 self-start sm:self-auto cursor-pointer"
          >
            🎲 Pick Random 3 Words
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {activePool.map((word) => {
            const isSelected = selectedWordIds.includes(word.id);
            return (
              <button
                key={word.id}
                onClick={() => toggleSelectWord(word.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{word.emoji}</span>
                <span className="capitalize">{word.word}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 flex justify-center">
          <button
            disabled={loading || selectedWordIds.length < 2}
            onClick={handleGenerateStory}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              loading || selectedWordIds.length < 2
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white hover:scale-102'
            }`}
          >
            <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300" />
            {loading ? 'Weaving Your Magical Tale...' : 'Generate Adventure Story!'}
          </button>
        </div>
      </div>

      {/* Generated Story Display */}
      {storyData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-violet-200 shadow-md space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                Adventure Tale
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {storyData.title}
              </h3>
            </div>

            <button
              onClick={handleReadStory}
              className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> Listen Aloud
            </button>
          </div>

          {/* Story Paragraph with Highlighted Words */}
          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/80">
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif">
              {storyData.story}
            </p>
          </div>

          {/* Moral or Lesson */}
          {storyData.moral && (
            <div className="text-xs font-semibold text-violet-800 italic bg-violet-50 p-3 rounded-xl border border-violet-100">
              💡 Adventure Lesson: {storyData.moral}
            </div>
          )}

          {/* Reading Comprehension Question */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-violet-600" />
              Reading Comprehension Check (+10 ⭐):
            </div>
            <p className="text-sm font-medium text-slate-700">
              {storyData.question}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              {storyData.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === storyData.correctAnswer;
                return (
                  <button
                    key={idx}
                    disabled={!!selectedAnswer}
                    onClick={() => handleCheckAnswer(opt)}
                    className={`p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-rose-50 border-rose-400 text-rose-900'
                        : selectedAnswer && isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div
                className={`p-3 rounded-xl text-xs font-bold text-center ${
                  isAnswerCorrect
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {isAnswerCorrect
                  ? 'Fantastic reading! You got it 100% right! +10 Star Coins! ⭐'
                  : `Good try! The correct answer was "${storyData.correctAnswer}".`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
