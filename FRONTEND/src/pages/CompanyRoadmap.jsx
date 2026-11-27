import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress, updateProgress } from '../services/api';
import toast from 'react-hot-toast';

const CompanyRoadmap = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('Amazon');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const roadmapStructure = {
    'Amazon': [
      { step: 1, title: 'Aptitude & Basics', topics: ['Quantitative Aptitude', 'Logical Reasoning', 'CS Fundamentals'] },
      { step: 2, title: 'DSA (Data Structures)', topics: ['Arrays & Strings', 'Linked List & Stack', 'Trees & Graphs', 'Dynamic Programming'] },
      { step: 3, title: 'Core CS Subjects', topics: ['DBMS & SQL', 'Operating Systems', 'Computer Networks', 'OOPs Concepts'] },
      { step: 4, title: 'Coding Practice', topics: ['Easy Problems', 'Medium Problems', 'Hard Problems', 'Company Tagged Qs'] },
      { step: 5, title: 'Interview Preparation', topics: ['Technical Interview', 'HR & Behavioral', 'AI Mock Interview'] }
    ]
  };

  const steps = roadmapStructure[selectedCompany] || roadmapStructure['Amazon'];

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const response = await getProgress(selectedCompany);
        const data = Array.isArray(response.data) ? response.data : [];
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgressData([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [selectedCompany]);

  const totalTopics = steps.reduce((acc, step) => acc + step.topics.length, 0);
  
  
  const completedTopics = progressData.filter(p => p.isCompleted).length;
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleToggle = async (topicName, currentStatus) => {
    const newStatus = !currentStatus;
    
    // UI ko turant update karna (Optimistic UI)
    const updatedProgress = [...progressData];
    const existingIndex = updatedProgress.findIndex(p => p.topic === topicName);
    
    if (existingIndex >= 0) {
      updatedProgress[existingIndex].isCompleted = newStatus;
    } else {
      updatedProgress.push({ topic: topicName, isCompleted: newStatus });
    }
    setProgressData(updatedProgress);

    try {
      await updateProgress(selectedCompany, topicName, newStatus);
      toast.success(newStatus ? 'Topic Completed! 🎉' : 'Topic marked as pending');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      
      const rollbackProgress = [...progressData];
      const idx = rollbackProgress.findIndex(p => p.topic === topicName);
      if (idx >= 0) rollbackProgress[idx].isCompleted = currentStatus;
      setProgressData(rollbackProgress);
    }
  };

  const isCompleted = (topicName) => {
    const found = progressData.find(p => p.topic === topicName);
    return found ? found.isCompleted : false;
  };

  const companies = ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys'];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          📍 Company Preparation Roadmap
        </h1>
        <p className="text-slate-400">Track your real progress and crack your dream company.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Real Progress</h2>
          <p className="text-slate-400 text-sm">{completedTopics} out of {totalTopics} topics completed</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-blue-400">{overallProgress}%</div>
          <div className="w-48 bg-slate-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-700" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-3 justify-center">
        {companies.map((company) => (
          <button
            key={company}
            onClick={() => setSelectedCompany(company)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              selectedCompany === company 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {company}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading your progress...</div>
        ) : (
          steps.map((step, index) => (
            <div key={index} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 relative">
              {index !== steps.length - 1 && (
                <div className="absolute left-8 top-full h-8 w-0.5 bg-slate-700"></div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold border border-blue-500/30">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </div>

              <div className="space-y-4 pl-14">
                {step.topics.map((topic, tIndex) => {
                  const completed = isCompleted(topic);
                  return (
                    <div key={tIndex} className="flex items-center gap-4 group">
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleToggle(topic, completed)}
                        className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700 cursor-pointer"
                      />
                      <span className={`text-sm font-medium transition ${completed ? 'text-green-400 line-through' : 'text-slate-300'}`}>
                        {topic}
                      </span>
                      {completed && <span className="text-green-400 text-xs">✅ Done</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-12 text-center">
        <button 
          onClick={() => navigate('/companies')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform transition hover:scale-105"
        >
          Start Mock Interview for {selectedCompany} 🚀
        </button>
      </div>
    </div>
  );
};

export default CompanyRoadmap;