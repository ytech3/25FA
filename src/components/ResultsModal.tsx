import React from 'react';
import { Prize } from '../types';
import { Trophy, Gift, X, Sparkles } from 'lucide-react';

interface ResultsModalProps {
  prize: Prize;
  userName: string;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ prize, userName, onClose }) => {
  const isGrandPrize = prize.name.includes('GRAND PRIZE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-in zoom-in duration-500">
        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>

        {/* Header */}
        <div 
          className={`text-white p-6 rounded-t-2xl relative overflow-hidden ${
            isGrandPrize 
              ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600' 
              : 'bg-gradient-to-r from-blue-900 to-blue-800'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isGrandPrize ? 'bg-white/20' : 'bg-yellow-400'
            }`}>
              {isGrandPrize ? (
                <Trophy className={`w-8 h-8 ${isGrandPrize ? 'text-white' : 'text-blue-900'}`} />
              ) : (
                <Gift className="w-8 h-8 text-blue-900" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
            <p className={`text-lg font-semibold ${
              isGrandPrize ? 'text-blue-900' : 'text-blue-200'
            }`}>
              {userName}, you won:
            </p>
          </div>
        </div>

        {/* Prize Details */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div 
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4"
              style={{ backgroundColor: prize.color, color: prize.textColor }}
            >
              {prize.name}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-blue-600" />
              Prize Details
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {prize.description}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-3">Next Steps</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• A Rays representative will contact you within 2-3 business days</li>
              <li>• Please check your email and phone for prize claim instructions</li>
              <li>• Valid ID may be required to claim your prize</li>
              <li>• Prize must be claimed within 30 days</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Awesome! 🎯
            </button>
            <button
              onClick={() => window.open('https://www.mlb.com/rays', '_blank')}
              className="flex-1 bg-white hover:bg-gray-50 text-blue-900 font-semibold py-3 px-6 rounded-lg border-2 border-blue-900 transition-all duration-200"
            >
              Visit Rays.com
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Thank you for participating! Go Rays! ⚾
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;