import React, { useState } from 'react';
import EntryForm from './components/EntryForm';
import SlotMachine from './components/SlotMachine';
import ResultsModal from './components/ResultsModal';
import { Prize } from './types';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

const prizes: Prize[] = [
  {
    id: 1,
    name: 'GRAND PRIZE: 2026 SUITE NIGHT',
    description: 'Experience the ultimate VIP treatment with a private suite for a 2026 Rays game, including food and beverages for up to 12 guests.',
    color: '#F5D130',
    textColor: '#092C5C'
  },
  {
    id: 2,
    name: 'CITY CONNECT JERSEY',
    description: 'Official Tampa Bay Rays City Connect jersey featuring the unique local-inspired design. Available in your preferred size.',
    color: '#092C5C',
    textColor: '#FFFFFF'
  },
  {
    id: 3,
    name: '2026 TICKETS',
    description: 'Four premium tickets to any 2026 regular season Rays home game of your choice, subject to availability.',
    color: '#8FBCE6',
    textColor: '#092C5C'
  },
  {
    id: 4,
    name: 'MERCH DISCOUNTS',
    description: '50% off your next purchase at the Rays Team Store, valid on regular-priced merchandise. Maximum discount $100.',
    color: '#FFFFFF',
    textColor: '#092C5C'
  },
  {
    id: 5,
    name: 'RAYS SWAG BAG',
    description: 'Official Rays merchandise bundle including a hat, t-shirt, keychain, and other exclusive team items.',
    color: '#4A90E2',
    textColor: '#FFFFFF'
  }
];

function App() {
  const [showEntryForm, setShowEntryForm] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleEntrySubmit = (data: UserData) => {
    setUserData(data);
    setShowEntryForm(false);
  };

  const handlePrizeWon = (prize: Prize) => {
    setWonPrize(prize);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setWonPrize(null);
  };

  const handleRestart = () => {
    setShowEntryForm(true);
    setUserData(null);
    setWonPrize(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Custom Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/rays-stadium.jpg)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -skew-y-12"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            {/* Tampa Bay Rays Logo */}
            <img 
              src="/images/logos/rays-logo.png" 
              alt="Tampa Bay Rays Logo" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hidden">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/TB.png" 
                  alt="TB Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Tampa Bay Rays
              </h1>
              <p className="text-yellow-400 font-semibold text-lg">
                Digital Prize Wheel
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
        {!showEntryForm && userData && (
          <div className="w-full max-w-4xl">
            <SlotMachine 
              prizes={prizes} 
              onPrizeWon={handlePrizeWon}
              userName={userData.firstName}
              userData={userData}
            />
            
            <div className="text-center mt-8">
              <button
                onClick={handleRestart}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showEntryForm && (
        <EntryForm onSubmit={handleEntrySubmit} />
      )}

      {showResults && wonPrize && (
        <ResultsModal 
          prize={wonPrize} 
          userName={userData?.firstName || ''} 
          onClose={handleCloseResults}
        />
      )}
    </div>
  );
}

export default App;