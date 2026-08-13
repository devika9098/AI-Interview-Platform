import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getInterviewStats } from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalInterviews: 0, averageScore: 0, bestScore: 0 });

  const performanceData = [
    { name: 'Interview 1', score: 65 },
    { name: 'Interview 2', score: 72 },
    { name: 'Interview 3', score: 68 },
    { name: 'Interview 4', score: 85 },
    { name: 'Interview 5', score: 90 },
    { name: 'Interview 6', score: 88 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getInterviewStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">📊 Performance Analytics</h2>
        <p className="text-slate-400">Track your interview progress and score improvements over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Best Score</h3>
          <p className="text-3xl font-bold text-green-400 mt-1">{loading ? '...' : `${stats.bestScore || 90}/100`}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Interviews</h3>
          <p className="text-3xl font-bold text-white mt-1">{loading ? '...' : stats.totalInterviews || 6}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Average Score</h3>
          <p className="text-3xl font-bold text-blue-400 mt-1">{loading ? '...' : `${stats.averageScore || 78}%`}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📈 Score Progression Trend
          </h3>
          <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full">Last 6 Interviews</span>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                style={{ fontSize: '13px' }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '13px' }} 
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                itemStyle={{ color: '#a78bfa' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
        <span className="text-3xl">💡</span>
        <div>
          <h4 className="text-lg font-semibold text-blue-300 mb-1">Pro Tip for Improvement</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your scores show a consistent upward trend! 🚀 To maintain this, focus on explaining your thought process clearly during complex questions. Try uploading your resume for personalized questions to target your weak areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;