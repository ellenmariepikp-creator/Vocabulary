import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { WordItem, GradeLevel } from '../types';
import { playSuccess } from '../utils/audio';

interface CustomWordWorkshopProps {
  customWords: WordItem[];
  onAddCustomWord: (word: WordItem) => void;
  onRemoveCustomWord: (id: string) => void;
  onBackToDashboard: () => void;
  soundEnabled: boolean;
}

export const CustomWordWorkshop: React.FC<CustomWordWorkshopProps> = ({
  customWords,
  onAddCustomWord,
  onRemoveCustomWord,
  onBackToDashboard,
  soundEnabled,
}) => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('grade_3_4');
  const [emoji, setEmoji] = useState('⭐');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !definition.trim()) return;

    const syllables = word.length > 5 ? [word.slice(0, 3), word.slice(3)] : [word];

    const newWord: WordItem = {
      id: `custom-${Date.now()}`,
      word: word.trim().toLowerCase(),
      simpleDefinition: definition.trim(),
      fullDefinition: definition.trim(),
      partOfSpeech: 'noun',
      exampleSentence: example.trim() || `The student used the word ${word} today.`,
      phonetic: `/${word}/`,
      syllables,
      synonyms: ['cool', 'special'],
      category: 'Custom Workshop',
      gradeLevel: grade,
      emoji: emoji || '🌟',
      mysteryClues: [
        'A custom word added in your workshop!',
        `Begins with the letter "${word[0]?.toUpperCase()}".`,
        `Example sentence: ${example || `We practiced the word ${word}.`}`,
        `Means: ${definition}`,
      ],
    };

    onAddCustomWord(newWord);
    playSuccess(soundEnabled);
    setSuccessMsg(`Word "${word}" added successfully to your quest games!`);
    setWord('');
    setDefinition('');
    setExample('');
    setTimeout(() => setSuccessMsg(''), 3000);
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

        <span className="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-1">
          <span>🛠️</span> Word Workshop
        </span>
      </div>

      {/* Intro Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Teacher & Parent Word Workshop
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Add your school's weekly spelling list or custom vocabulary words! Any word added here is automatically playable across Bubble Pop, Tile Scramble, Memory Safari, and Word Detective!
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-600" /> Add New Vocabulary Word
        </h3>

        {successMsg && (
          <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Word *
            </label>
            <input
              type="text"
              required
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. courageous, hibernate, galaxy"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Emoji Icon
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="e.g. 🚀, 🦁, 💎"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kid-Friendly Meaning *
          </label>
          <input
            type="text"
            required
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="e.g. Very brave even when feeling afraid"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Example Sentence (Optional)
          </label>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="e.g. The courageous explorer climbed the steep mountain."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Target Grade Level
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as GradeLevel)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white text-slate-700"
          >
            <option value="grade_1_2">Grades 1-2 (Early)</option>
            <option value="grade_3_4">Grades 3-4 (Adventures)</option>
            <option value="grade_5_6">Grades 5-6 (Mastery)</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Save to Game Word Bank
          </button>
        </div>
      </form>

      {/* List of Custom Words */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900">
          Your Custom Words ({customWords.length})
        </h3>

        {customWords.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No custom words added yet. Add words above to create your own customized spelling challenges!
          </p>
        ) : (
          <div className="grid gap-3">
            {customWords.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{w.emoji}</span>
                  <div>
                    <span className="font-display font-bold text-slate-900 capitalize">
                      {w.word}
                    </span>
                    <p className="text-xs text-slate-500">{w.simpleDefinition}</p>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveCustomWord(w.id)}
                  title="Remove custom word"
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
