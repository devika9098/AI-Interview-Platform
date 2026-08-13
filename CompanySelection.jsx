import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aptitudeQuestions, techQuestions, codingQuestions } from '../data/roundQuestions';

const CompanySelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [modalCompany, setModalCompany] = useState(null);

  const companies = [
    { name: 'Google', color: 'text-blue-400', package: '15-30 LPA', questions: '250+', success: '68%' },
    { name: 'Microsoft', color: 'text-blue-300', package: '₹15-30 LPA', questions: '250+', success: '68%' },
    { name: 'Meta', color: 'text-blue-500', package: '₹15-30 LPA', questions: '250+', success: '68%' },
    { name: 'Apple', color: 'text-gray-300', package: '₹15-30 LPA', questions: '250+', success: '68%' },
    { name: 'Amazon', color: 'text-orange-400', package: '15-30 LPA', questions: '250+', success: '68%' },
    { name: 'TCS', color: 'text-blue-400', package: '₹4-9 LPA', questions: '250+', success: '75%' },
    { name: 'Infosys', color: 'text-blue-300', package: '₹4-9 LPA', questions: '250+', success: '72%' },
    { name: 'Wipro', color: 'text-purple-400', package: '₹4-9 LPA', questions: '250+', success: '70%' },
    { name: 'Accenture', color: 'text-green-400', package: '₹4-9 LPA', questions: '250+', success: '74%' },
  ];

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (company) => {
    setModalCompany(company);
    setShowRoundsModal(true);
  };

  const handleRoundSelect = (round) => {
    let selectedQuestions = [];
    
    if (round === 'Aptitude') {
      selectedQuestions = aptitudeQuestions;
    } else if (round === 'Technical Interview') {
      selectedQuestions = techQuestions;
    } else if (round === 'Coding') {
      selectedQuestions = codingQuestions;
    }

    navigate('/interview', { 
      state: { 
        questions: selectedQuestions, 
        roundType: round, 
        companyName: modalCompany.name 
      } 
    });
    setShowRoundsModal(false);
  };

  const closeModal = () => {
    setShowRoundsModal(false);
    setModalCompany(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 flex flex-col items-center relative">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Company Selection Screen - Choose Your Dream Company
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-10">
        {['SDE', 'Frontend', 'Backend'].map((role) => (
          <button key={role} className="px-6 py-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-blue-600 hover:border-blue-500 transition font-medium">
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
        {filteredCompanies.map((company) => (
          <div 
            key={company.name}
            onClick={() => handleCompanyClick(company)}
            className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group flex flex-col justify-center border-slate-700 bg-slate-800/50 hover:border-blue-400 hover:bg-slate-800 hover:scale-105"
          >
            <h3 className={`text-3xl font-extrabold mb-4 text-center ${company.color}`}>
              {company.name}
            </h3>
            
            <div className="text-yellow-400 text-sm mb-4 text-center tracking-widest">⭐⭐⭐⭐⭐</div>
            
            <div className="space-y-2 text-center">
              <p className="text-slate-300 text-sm">Avg package: <span className="text-white font-semibold">{company.package}</span></p>
              <p className="text-slate-300 text-sm">{company.questions} questions available</p>
              <p className="text-slate-300 text-sm">{company.success} success rate</p>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-blue-400 font-semibold">Click to choose round →</span>
            </div>
          </div>
        ))}

        {/* Custom/Other Card */}
        <div 
          onClick={() => handleCompanyClick({ name: 'Custom', color: 'text-slate-200' })}
          className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center border-slate-700 bg-slate-800/50 hover:border-purple-400 hover:scale-105"
        >
          <h3 className="text-3xl font-extrabold text-slate-200 mb-4">Custom/Other ⚙️</h3>
          <p className="text-slate-400 text-sm">Prepare for any other company</p>
        </div>
      </div>

      {/* 3 Rounds Selection Modal */}
      {showRoundsModal && modalCompany && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={closeModal}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-3xl w-full shadow-2xl relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none"
            >
              ✕
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                Select Round for <span className={modalCompany.color}>{modalCompany.name}</span>
              </h2>
              <p className="text-slate-400">Choose the hiring stage you want to practice</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => handleRoundSelect('Aptitude')}
                className="group bg-slate-900/50 border-2 border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
                <h3 className="text-xl font-bold text-white mb-2">Aptitude Round</h3>
                <p className="text-slate-400 text-sm">Logical, Quantitative & Verbal Ability</p>
              </div>

              <div 
                onClick={() => handleRoundSelect('Technical Interview')}
                className="group bg-slate-900/50 border-2 border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎙️</div>
                <h3 className="text-xl font-bold text-white mb-2">Tech Interview</h3>
                <p className="text-slate-400 text-sm">Core Subjects, Projects & HR Questions</p>
              </div>

              <div 
                onClick={() => handleRoundSelect('Coding')}
                className="group bg-slate-900/50 border-2 border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💻</div>
                <h3 className="text-xl font-bold text-white mb-2">Coding Round</h3>
                <p className="text-slate-400 text-sm">DSA, Problem Solving & Algorithms</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelection;