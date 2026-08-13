import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const userName = userData?.name || 'User';

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="text-center max-w-4xl mx-auto z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 backdrop-blur-md mb-8 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-300">AI Interviewer is Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Welcome back, <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            {userName}
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Your personal AI interviewer is ready to help you crack your dream job. 
          Let's polish your skills today!
        </p>

        <div className="flex justify-center mb-16">
          <button 
            onClick={() => navigate('/difficulty')}
            className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 skew-x-12"></div>
            
            <span className="flex items-center gap-3 relative z-10">
              🚀 Start Mock Interview
            </span>
          </button>
         
        </div>

        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
        </p>
      </div>
    </div>
  );
};

export default Dashboard;