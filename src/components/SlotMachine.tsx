import React, { useState, useEffect } from 'react';
import { Prize } from '../types';
import { Trophy, Shirt, Ticket, Percent, Gift } from 'lucide-react';
import { supabase, ParticipantEntry } from '../lib/supabase';
import { UserData } from '../App';

interface SlotMachineProps {
  prizes: Prize[];
  onPrizeWon: (prize: Prize) => void;
  userName: string;
  userData: UserData;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ prizes, onPrizeWon, userName, userData }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinningReels, setSpinningReels] = useState([false, false, false]);

  // Prize icons mapping with custom images
  const prizeIcons = {
    1: { icon: Trophy, color: '#F5D130', bgColor: '#092C5C' },     // Grand Prize
    2: { icon: Shirt, color: '#FFFFFF', bgColor: '#092C5C' },      // Jersey  
    3: { icon: Ticket, color: '#092C5C', bgColor: '#8FBCE6' },     // Tickets
    4: { icon: Percent, color: '#092C5C', bgColor: '#FFFFFF' },    // Discounts
    5: { icon: Gift, color: '#FFFFFF', bgColor: '#4A90E2' }        // Swag Bag
  };

  const saveParticipantEntry = async (wonPrize: Prize) => {
    if (!supabase) {
      console.warn('Supabase not connected. Entry not saved:', { prize: wonPrize });
      return;
    }
    
    try {
      const entry: Omit<ParticipantEntry, 'id'> = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        marketing_opt_in: userData.marketingOptIn,
        prize_won: wonPrize.name,
        prize_id: wonPrize.id,
        entry_timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('participants')
        .insert([entry]);

      if (error) {
        console.error('Error saving participant entry:', error);
      } else {
        console.log('Participant entry saved successfully');
      }
    } catch (error) {
      console.error('Error saving participant entry:', error);
    }
  };

  const spinSlots = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinningReels([true, true, true]);

    // Prize odds (must total 100%)
    const prizeOdds = [
      { prizeIndex: 0, weight: 1 },   // Grand Prize: 1%
      { prizeIndex: 1, weight: 2 },   // City Connect Jersey: 2%
      { prizeIndex: 2, weight: 5 },   // 2026 Tickets: 5%
      { prizeIndex: 3, weight: 90 },  // Merch Discounts: 90%
      { prizeIndex: 4, weight: 2 }    // Rays Swag Bag: 2%
    ];

    // Select winning prize based on weighted odds
    const totalWeight = prizeOdds.reduce((sum, prize) => sum + prize.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    let winningPrizeIndex = 3; // Default to most common prize (Merch Discounts)
    
    for (const prize of prizeOdds) {
      currentWeight += prize.weight;
      if (random <= currentWeight) {
        winningPrizeIndex = prize.prizeIndex;
        break;
      }
    }

    // Simulate spinning each reel with different durations
    const spinDurations = [2000, 2500, 3000];
    
    // Always win - set all reels to the selected winning prize
    const finalResults = [winningPrizeIndex, winningPrizeIndex, winningPrizeIndex];

    // Stop each reel at different times
    spinDurations.forEach((duration, index) => {
      setTimeout(() => {
        setSpinningReels(prev => {
          const newSpinning = [...prev];
          newSpinning[index] = false;
          return newSpinning;
        });
        
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = finalResults[index];
          return newReels;
        });
      }, duration);
    });

    // Check for win after all reels stop
    setTimeout(async () => {
      setIsSpinning(false);
      
      // Always trigger win since we guarantee matching symbols
      const winningPrize = prizes[finalResults[0]];
      
      // Save participant entry to database
      await saveParticipantEntry(winningPrize);
      
      setTimeout(() => onPrizeWon(winningPrize), 500);
    }, 3200);
  };

  const renderReel = (reelIndex: number) => {
    const currentPrizeIndex = reels[reelIndex];
    const prize = prizes[currentPrizeIndex];
    const prizeId = prize?.id || 1;
    const iconData = prizeIcons[prizeId as keyof typeof prizeIcons];

    return (
      <div className="relative w-24 h-32 md:w-32 md:h-40 bg-white rounded-lg shadow-lg border-4 border-gray-300 overflow-hidden">
        {/* Spinning Animation Overlay */}
        {spinningReels[reelIndex] && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-transparent to-blue-500/20 animate-bounce"></div>
          </div>
        )}
        
        {/* Reel Content */}
        <div 
          className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${
            spinningReels[reelIndex] ? 'animate-spin' : ''
          }`}
          style={{ backgroundColor: iconData.bgColor }}
        >
          {/* Prize Image with proper fallback */}
          <div className="w-8 h-8 md:w-12 md:h-12 mb-2 flex items-center justify-center">
            <img 
              src={`/prize-${prizeId}.png`}
              alt={prize?.name || 'Prize'}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.log(`❌ Failed to load image: /prize-${prizeId}.png`);
                console.log(`Full URL attempted: ${window.location.origin}/prize-${prizeId}.png`);
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const IconComponent = iconData.icon;
                  parent.innerHTML = '';
                  const iconDiv = document.createElement('div');
                  iconDiv.innerHTML = `<svg class="w-full h-full" style="color: ${iconData.color}" fill="currentColor" viewBox="0 0 24 24"><use href="#icon-${prizeId}"></use></svg>`;
                  parent.appendChild(iconDiv);
                }
              }}
            />
          </div>
          <div 
            className="text-xs md:text-sm font-bold text-center px-2 leading-tight"
            style={{ color: iconData.color }}
          >
            {prize?.name.split(':')[0] || 'PRIZE'}
          </div>
        </div>

        {/* Reel Frame Effect */}
        <div className="absolute inset-0 border-2 border-gray-400 rounded-lg pointer-events-none"></div>
        
        {/* Winning Glow Effect */}
        {!isSpinning && reels[0] === reels[1] && reels[1] === reels[2] && (
          <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg animate-pulse shadow-lg shadow-yellow-400/50"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Welcome Message */}
      <div className="text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome, {userName}! 🎰
        </h2>
        <p className="text-blue-200 text-lg">
          Pull the lever and match 3 symbols to win amazing Rays prizes!
        </p>
      </div>

      {/* Slot Machine Container */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-4 border-yellow-400">
        {/* Machine Header */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-6 py-2 rounded-full font-bold text-lg mb-4">
            🏆 RAYS JACKPOT 🏆
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Slot Reels */}
        <div className="flex justify-center space-x-4 mb-8">
          {reels.map((_, index) => renderReel(index))}
        </div>

        {/* Win Line Indicator */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-sm h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-300 mb-6">
          <p className="text-sm">Every spin is a winner!</p>
          <p className="text-xs text-gray-400 mt-1">Pull the lever to claim your prize</p>
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <button
            onClick={spinSlots}
            disabled={isSpinning}
            className={`px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 shadow-lg ${
              isSpinning
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transform hover:scale-105 active:scale-95 shadow-red-500/25'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                SPINNING...
              </span>
            ) : (
              '🎰 PULL LEVER 🎰'
            )}
          </button>
        </div>
      </div>

      {/* Prize Reference */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-2xl">
        <h3 className="text-white font-bold text-lg mb-4 text-center">Prize Symbols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prizes.map((prize) => {
            const iconData = prizeIcons[prize.id as keyof typeof prizeIcons];
            
            return (
              <div key={prize.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: iconData.bgColor }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img 
                      src={`/prize-${prize.id}.png`}
                      alt={prize.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.log(`Failed to load reference image: /prize-${prize.id}.png`);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const IconComponent = iconData.icon;
                          parent.innerHTML = '';
                          const iconElement = document.createElement('div');
                          iconElement.innerHTML = `<div style="color: ${iconData.color}; width: 100%; height: 100%; display: flex; align-items: center; justify-center;">🏆</div>`;
                          parent.appendChild(iconElement);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{prize.name}</div>
                  <div className="text-blue-200 text-xs">{prize.description.substring(0, 50)}...</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;