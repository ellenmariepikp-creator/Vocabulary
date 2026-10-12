import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, Volume2, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, GradeLevel } from '../types';
import { speakWord, playSuccess } from '../utils/audio';

interface SentenceBuilderProps {
  words: WordItem[];
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToDashboard: () => void;
  onAwardStars: (amount: number, wordId?: string) => void;
}

interface SentenceFeedback {
  usesWordCorrectly: boolean;
  feedback: string;
  starsAwarded: number;
  bonusTip: string;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  words,
  currentGrade,
  soundEnabled,
  onBackToDashboard,
  onAwardStars,
}) => {
  const filteredWords = words.filter(w => w.gradeLevel === currentGrade);
  const pool = filteredWords.length > 0 ? filteredWords : words;

  const [selectedWord, setSelectedWord] = useState<WordItem>(pool[0]);
  const [userSentence, setUserSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentenceFeedback | null>(null);

  const handleSubmitSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/sentence-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: selectedWord.word,
          sentence: userSentence,
          studentGrade: currentGrade,
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data: SentenceFeedback = await response.json();
      setResult(data);
      onAwardStars(data.starsAwarded, selectedWord.id);
      playSuccess(soundEnabled);
      if (data.usesWordCorrectly) {
        confetti({ particleCount: 50, spread: 50 });
      }
    } catch (err) {
      // Fallback
      const hasWord = userSentence.toLowerCase().includes(selectedWord.word.toLowerCase());
      const fallback: SentenceFeedback = {
        usesWordCorrectly: hasWord,
        feedback: hasWord
          ? `Super star writer! You used "${selectedWord.word}" wonderfully in your sentence! ⭐`
          : `Great start! Be sure to include the exact word "${selectedWord.word}" in your sentence.`,
        starsAwarded: hasWord ? 3 : 1,
        bonusTip: `Try writing another sentence with one of its synonyms: ${selectedWord.synonyms.join(', ')}!`,
      };
      setResult(fallback);
      onAwardStars(fallback.starsAwarded, selectedWord.id);
      playSuccess(soundEnabled);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>

        <span className="text-xs sm:text-sm font-bold text-teal-700 flex items-center gap-1">
          <span>✍️</span> Sentence Builder Lab
        </span>
      </div>

      {/* Target Word Selection Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Choose a Word to Write With:
          </h2>
          <p className="text-xs text-slate-500">
            Write your own original sentence and our friendly Word Wizard will review it!
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {pool.map((w) => {
            const isSelected = w.id === selectedWord.id;
            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWord(w);
                  setResult(null);
                  setUserSentence('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{w.emoji}</span>
                <span className="capitalize">{w.word}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Word Details Card */}
        <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedWord.emoji}</span>
              <h3 className="font-display text-xl font-bold text-teal-950 capitalize">
                {selectedWord.word}
              </h3>
              <button
                onClick={() => speakWord(selectedWord.word)}
                className="p-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-teal-800 mt-1 font-medium">
              Meaning: {selectedWord.simpleDefinition}
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white/80 px-3 py-1.5 rounded-xl border border-teal-100/60">
            Synonyms: <strong className="text-slate-800">{selectedWord.synonyms.join(', ')}</strong>
          </div>
        </div>

        {/* Sentence Input Form */}
        <form onSubmit={handleSubmitSentence} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Creative Sentence:
            </label>
            <textarea
              rows={3}
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder={`Write a cool sentence including the word "${selectedWord.word}"...`}
              className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 text-sm font-medium"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Tip: Start with a capital letter and end with a full stop or exclamation mark!
            </span>

            <button
              type="submit"
              disabled={loading || !userSentence.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                loading || !userSentence.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Checking sentence...' : 'Submit & Check'}
            </button>
          </div>
        </form>

        {/* Feedback Card */}
        {result && (
          <div
            className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
              result.usesWordCorrectly
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Word Wizard Feedback:
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                +{result.starsAwarded} Stars Awarded ⭐
              </span>
            </div>

            <p className="text-sm text-slate-800 font-medium">
              {result.feedback}
            </p>

            {result.bonusTip && (
              <p className="text-xs text-slate-600 italic bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                💡 Tip: {result.bonusTip}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
