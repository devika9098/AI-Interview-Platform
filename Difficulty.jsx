import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Difficulty = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (level) => {

    navigate('/interview', { state: { difficulty: level } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 flex flex-col items-center justify-center">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Choose Your Difficulty Level
        </h1>
        <p className="text-slate-400 text-lg">
          Select the level that matches your current preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        <div 
          onClick={() => handleSelect('easy')}
          className="bg-slate-800/50 border border-slate-700 hover:border-green-500 rounded-2xl p-8 cursor-pointer transform transition hover:scale-105 hover:bg-slate-800 group"
        >
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-2xl font-bold text-green-400 mb-2 group-hover:text-green-300">Easy</h3>
          <p className="text-slate-400 text-sm">
            Basic concepts, definitions, and straightforward questions. Perfect for beginners.
          </p>
        </div>

        <div 
          onClick={() => handleSelect('medium')}
          className="bg-slate-800/50 border border-slate-700 hover:border-yellow-500 rounded-2xl p-8 cursor-pointer transform transition hover:scale-105 hover:bg-slate-800 group"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300">Medium</h3>
          <p className="text-slate-400 text-sm">
            Scenario-based questions and moderate problem-solving. Good for regular practice.
          </p>
        </div>

        <div 
          onClick={() => handleSelect('hard')}
          className="bg-slate-800/50 border border-slate-700 hover:border-red-500 rounded-2xl p-8 cursor-pointer transform transition hover:scale-105 hover:bg-slate-800 group"
        >
          <div className="text-5xl mb-4">🔥</div>
          <h3 className="text-2xl font-bold text-red-400 mb-2 group-hover:text-red-300">Hard</h3>
          <p className="text-slate-400 text-sm">
            Advanced concepts, system design, and deep technical questions. For expert preparation.
          </p>
        </div>

      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-12 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

    </div>
  );
};

export default Difficulty;