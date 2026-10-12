import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Lock, Heart, Award, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompanionPet, HatItem, GameStats } from '../types';
import { COMPANION_PETS, ACCESSORY_HATS } from '../data/words';
import { playSuccess, playCoinSound, speakWord } from '../utils/audio';

interface PetClosetProps {
  stats: GameStats;
  currentPet: CompanionPet;
  onSelectPet: (petId: string) => void;
  onEquipHat: (hatId: string) => void;
  onBuyHat: (hat: HatItem) => void;
  onBackToDashboard: () => void;
  soundEnabled: boolean;
}

export const PetCloset: React.FC<PetClosetProps> = ({
  stats,
  currentPet,
  onSelectPet,
  onEquipHat,
  onBuyHat,
  onBackToDashboard,
  soundEnabled,
}) => {
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState<'buddies' | 'hats'>('buddies');

  const equippedHat = ACCESSORY_HATS.find(h => h.id === stats.equippedHatId);

  const handlePurchaseOrEquip = (hat: HatItem) => {
    const isUnlocked = stats.unlockedHats.includes(hat.id);
    if (isUnlocked) {
      onEquipHat(hat.id);
      playSuccess(soundEnabled);
    } else {
      if (stats.totalStars >= hat.cost) {
        onBuyHat(hat);
        playCoinSound(soundEnabled);
        confetti({ particleCount: 50, spread: 50 });
      }
    }
  };

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

        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Star Coins: <strong className="font-mono">{stats.totalStars}</strong></span>
        </div>
      </div>

      {/* Hero Showcase Card for Current Pet */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="grid md:grid-cols-12 items-center gap-6 relative z-10">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-40 h-40 rounded-3xl bg-white/30 backdrop-blur-md border-4 border-white/50 flex flex-col items-center justify-center text-7xl shadow-xl">
              <span>{currentPet.emoji}</span>
              {equippedHat && equippedHat.id !== 'hat-none' && (
                <span className="absolute -top-4 -right-2 text-4xl animate-bounce">
                  {equippedHat.emoji}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-current" /> Active Companion
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentPet.name}
            </h2>
            <p className="text-amber-100 text-sm max-w-lg leading-relaxed">
              "{currentPet.personality}"
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
              <span className="bg-white/20 px-3 py-1 rounded-lg">
                Title: <strong>{currentPet.title}</strong>
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                Fav Word: <strong className="underline">{currentPet.favoriteWord}</strong>
                <button
                  onClick={() => speakWord(currentPet.favoriteWord)}
                  className="hover:scale-110 transition-transform"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">
                Equipped: <strong>{equippedHat ? equippedHat.name : 'Natural'}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Choose Pet Buddy vs Wardrobe Accessories */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('buddies')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'buddies'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐾 Choose Pet Companion
            </button>
            <button
              onClick={() => setActiveTab('hats')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'hats'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎩 Wardrobe Shop
            </button>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Earn stars in challenges to unlock more outfits!
          </span>
        </div>

        {activeTab === 'buddies' ? (
          /* Pet Selection Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANION_PETS.map((pet) => {
              const isSelected = pet.id === currentPet.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => onSelectPet(pet.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">
                      {pet.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-bold text-slate-900 text-base">
                          {pet.name}
                        </h4>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-emerald-500 text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-amber-700">{pet.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {pet.personality}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Fav Word: <strong>{pet.favoriteWord}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPet(pet.id);
                        playSuccess(soundEnabled);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Choose'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Wardrobe Shop Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCESSORY_HATS.map((hat) => {
              const isUnlocked = stats.unlockedHats.includes(hat.id);
              const isEquipped = stats.equippedHatId === hat.id;
              const canAfford = stats.totalStars >= hat.cost;

              return (
                <div
                  key={hat.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                      : isUnlocked
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl py-2">{hat.emoji}</div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">
                      {hat.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-tight">
                      {hat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handlePurchaseOrEquip(hat)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                      >
                        Equip Hat
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => handlePurchaseOrEquip(hat)}
                        className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          canAfford
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Buy for {hat.cost} ⭐
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Needs {hat.cost} ⭐
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
