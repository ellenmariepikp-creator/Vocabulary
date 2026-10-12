import React from 'react';
import { X, Volume2, Sparkles, CheckCircle2, Play, BookOpen } from 'lucide-react';
import { WordItem } from '../types';
import { speakWord } from '../utils/audio';

interface WordDetailModalProps {
  word: WordItem | null;
  onClose: () => void;
  onPlayWithWord: (word: WordItem, game: 'bubble_pop' | 'word_scramble' | 'sentence_builder') => void;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  onPlayWithWord,
  isMastered,
  onToggleMastered,
}) => {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Word Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">{word.emoji}</div>
          <div className="flex items-center justify-center gap-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 capitalize tracking-tight">
              {word.word}
            </h2>
            <button
              onClick={() => speakWord(word.word)}
              title="Pronounce Word"
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-slate-600 font-semibold">{word.phonetic}</span>
            <span>·</span>
            <span className="italic">{word.partOfSpeech}</span>
            <span>·</span>
            <span>{word.category}</span>
          </div>
        </div>

        {/* Syllables Phonics Practice */}
        <div className="my-5 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-100 text-center">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2">
            Tap syllables to sound them out:
          </span>
          <div className="flex items-center justify-center gap-2">
            {word.syllables.map((syl, idx) => (
              <button
                key={idx}
                onClick={() => speakWord(syl, 0.75)}
                className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-amber-950 font-mono text-sm font-bold rounded-xl border border-amber-200 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {syl}
              </button>
            ))}
          </div>
        </div>

        {/* Kid Meaning & Example */}
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Kid-Friendly Meaning:
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900">
              "{word.simpleDefinition}"
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              In a Sentence:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 italic">
              {word.exampleSentence}
            </p>
          </div>

          {/* Synonyms */}
          {word.synonyms.length > 0 && (
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="font-bold text-slate-500">Synonyms:</span>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((syn, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium text-[11px]">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleMastered(word.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isMastered
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isMastered ? 'Mastered!' : 'Mark as Mastered'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onPlayWithWord(word, 'bubble_pop');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play in Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
