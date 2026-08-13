import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviewHistory } from '../services/api';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getInterviewHistory();
      setInterviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your interviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          AI Interview Platform
        </h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="max-w-5xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-2">📜 Your Interview History</h2>
        <p className="text-slate-400">Review your past interviews and track your progress</p>
      </div>
      <div className="max-w-5xl mx-auto">
        {interviews.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No interviews yet!</h3>
            <p className="text-slate-400 mb-6">Start your first mock interview to see your history here.</p>
            <button
              onClick={() => navigate('/interview')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition"
            >
              Start First Interview 🚀
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, index) => {
              const percentage = Math.round((interview.totalScore / interview.maxScore) * 100);
              const date = new Date(interview.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={interview._id}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🎯</span>
                        <h3 className="text-xl font-bold">Interview #{interviews.length - index}</h3>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium uppercase">
                          {interview.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">📅 {date}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {percentage}%
                      </div>
                      <div className="text-sm text-slate-400">
                        {interview.totalScore}/{interview.maxScore}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        percentage >= 80 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-400">
                    📝 {interview.answers.length} questions answered
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

export default InterviewHistory;