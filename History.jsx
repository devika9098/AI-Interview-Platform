import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const History = () => {
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  
  const [history, setHistory] = useState([
    { 
      id: 1, 
      date: 'Today, 2:30 PM', 
      difficulty: 'Personalized', 
      score: 80, 
      totalQuestions: 10,
      questions: [
        { q: "Explain the concept of Virtual DOM in React.", answer: "Virtual DOM is a lightweight JavaScript representation of the actual DOM.", feedback: "Excellent! You clearly explained the reconciliation process.", score: 90 },
        { q: "What is the difference between State and Props?", answer: "Props are passed to the component like function parameters.", feedback: "Good basic understanding. Try to add an example.", score: 75 },
        { q: "Explain useEffect hook with a practical example.", answer: "useEffect is used for side effects in functional components.", feedback: "Too brief! Mention dependency array and cleanup function.", score: 60 },
        { q: "What is JSX and how is it different from HTML?", answer: "JSX is a syntax extension for JavaScript that looks like HTML.", feedback: "Perfect! Very clear and concise explanation.", score: 85 },
        { q: "What are React Hooks? Name a few commonly used ones.", answer: "Hooks let you use state and other React features. Examples: useState, useEffect.", feedback: "Great answer! You covered the main hooks accurately.", score: 80 },
        { q: "What is Prop Drilling and how can you avoid it?", answer: "Prop drilling is passing data through multiple levels. Avoid using Context API.", feedback: "Good explanation. Elaborate slightly more on Context API.", score: 65 },
        { q: "How do you handle forms and user input in React?", answer: "I use controlled components where input value is tied to state.", feedback: "Excellent practical approach!", score: 90 },
        { q: "What is the Context API and when would you use it?", answer: "Context API provides a way to pass data without passing props manually.", feedback: "Accurate definition. Mention 'global data' like themes.", score: 70 },
        { q: "Explain the React Component Lifecycle in functional components.", answer: "Lifecycle is managed via useEffect. Mounting, updating, unmounting.", feedback: "Very well explained!", score: 85 },
        { q: "How do you optimize the performance of a large-scale React app?", answer: "By using React.memo, useMemo, useCallback, and code splitting.", feedback: "Outstanding! You hit all the major keywords.", score: 95 }
      ]
    },
    { 
      id: 2, 
      date: 'Yesterday, 5:15 PM', 
      difficulty: 'Medium', 
      score: 75, 
      totalQuestions: 10,
      questions: [
        { q: "What is the difference between State and Props in React?", answer: "State is internal and mutable, while Props are external and immutable.", feedback: "Good distinction! Add an example of passing props from parent to child.", score: 80 },
        { q: "Explain the concept of Virtual DOM and how it improves performance.", answer: "Virtual DOM is a copy of the real DOM. React updates it first to save rendering time.", feedback: "Correct, but you missed explaining the 'Diffing Algorithm'.", score: 70 },
        { q: "What are React Hooks? Can you name a few commonly used hooks?", answer: "Hooks are functions that let you use state. useState, useEffect, useRef.", feedback: "Perfect answer! Very concise and accurate.", score: 90 },
        { q: "What is the purpose of the useEffect hook? Give a practical example.", answer: "useEffect handles side effects like data fetching or subscriptions.", feedback: "Good example. Don't forget to mention the dependency array.", score: 75 },
        { q: "How do you handle API calls in a React application?", answer: "I use fetch or axios inside useEffect to call APIs on component mount.", feedback: "Standard approach. Mentioning async/await and error handling would be better.", score: 65 },
        { q: "Explain the difference between functional and class components.", answer: "Functional components are simpler and use hooks, class components use 'this' and lifecycle methods.", feedback: "Very clear explanation. Well done!", score: 85 },
        { q: "What is Context API and when would you use it over Props drilling?", answer: "Context API is for global state. It avoids passing props down multiple levels.", feedback: "Incomplete answer. Explain how to create and consume context.", score: 60 },
        { q: "How do you handle forms and user input in React?", answer: "Using controlled components with onChange handlers to update state.", feedback: "Excellent! Mentioning validation would make it a 10/10 answer.", score: 80 },
        { q: "What is the significance of controlled vs uncontrolled components?", answer: "Controlled components have React state as the single source of truth.", feedback: "Good definition. Give a real-world scenario for uncontrolled components.", score: 70 },
        { q: "Explain the component lifecycle in functional components.", answer: "Mounting, Updating, and Unmounting are handled by the useEffect hook.", feedback: "Accurate! You clearly understand the modern React lifecycle.", score: 75 }
      ]
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const downloadPDF = (interview) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("AI Interview Report", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${interview.date}`, 20, 35);
    doc.text(`Difficulty: ${interview.difficulty}`, 20, 45);
    doc.text(`Overall Score: ${interview.score}%`, 20, 55);
    doc.text(`Total Questions: ${interview.totalQuestions}`, 20, 65);

    let yPos = 80;

    interview.questions.forEach((q, index) => {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      const splitQ = doc.splitTextToSize(`Q${index + 1}: ${q.q}`, 170);
      doc.text(splitQ, 20, yPos);
      yPos += splitQ.length * 6 + 4;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      const splitA = doc.splitTextToSize(`Your Answer: ${q.answer}`, 170);
      doc.text(splitA, 20, yPos);
      yPos += splitA.length * 5 + 4;

      doc.setTextColor(100, 100, 100);
      const splitF = doc.splitTextToSize(`AI Feedback: ${q.feedback} (Score: ${q.score}%)`, 170);
      doc.text(splitF, 20, yPos);
      yPos += splitF.length * 5 + 8;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by AI Interview Platform | Page ${i} of ${pageCount}`, 105, 290, null, null, "center");
    }

    doc.save(`Interview_Report_${interview.id}_Full.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      <h2 className="text-3xl font-bold text-white mb-6">📜 Interview History</h2>
      
      {loading ? (
        <div className="text-center text-slate-400 py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-slate-400 py-16 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-xl font-medium">No interviews completed yet.</p>
          <p className="mt-2 text-sm">Start your first mock interview to see your history here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center hover:bg-slate-800 transition group">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                  item.score >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  item.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {item.score}%
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {item.difficulty} Interview
                    {item.difficulty === 'Personalized' && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Resume Based</span>}
                  </h3>
                  <p className="text-sm text-slate-400">{item.date} • {item.totalQuestions} Questions</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInterview(item)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-lg"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedInterview && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setSelectedInterview(null)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4 sticky top-0 bg-slate-800 z-10">
              <div>
                <h3 className="text-2xl font-bold text-white">Interview Details</h3>
                <p className="text-slate-400 text-sm mt-1">{selectedInterview.date} • {selectedInterview.difficulty} • {selectedInterview.totalQuestions} Questions</p>
              </div>
              <button 
                onClick={() => setSelectedInterview(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-2 bg-slate-900/50 p-4 rounded-xl">
              <span className="text-slate-300 font-medium">Overall Score:</span>
              <span className={`px-4 py-1.5 rounded-full font-bold text-lg ${
                selectedInterview.score >= 80 ? 'bg-green-500/20 text-green-400' :
                selectedInterview.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {selectedInterview.score}%
              </span>
            </div>

            <div className="flex justify-end mb-6 mt-2">
              <button 
                onClick={() => downloadPDF(selectedInterview)}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-lg flex items-center gap-2"
              >
                📄 Download Full PDF Report
              </button>
            </div>

            {selectedInterview.questions.some(q => q.score < 70) && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                <h4 className="text-red-400 font-semibold flex items-center gap-2 mb-2">
                  ⚠️ Areas to Improve
                </h4>
                <p className="text-slate-300 text-sm">
                  You scored below 70% in {selectedInterview.questions.filter(q => q.score < 70).length} question(s). 
                  Review them carefully below (marked with 🔴).
                </p>
              </div>
            )}

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white mb-4">All Questions & Answers:</h4>
              
              {selectedInterview.questions.map((q, index) => (
                <div 
                  key={index} 
                  className={`p-5 rounded-xl border-2 ${
                    q.score < 70 
                      ? 'bg-red-500/5 border-red-500/50 shadow-lg shadow-red-500/10'
                      : 'bg-slate-900/50 border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                      Question {index + 1} {q.score < 70 && '🔴'}
                    </h5>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      q.score >= 80 ? 'bg-green-500/20 text-green-400' :
                      q.score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {q.score}%
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-200 font-medium">{q.q}</p>
                  </div>

                  <div className="mb-4 bg-slate-800 p-3 rounded-lg">
                    <h6 className="text-xs font-semibold text-purple-400 uppercase mb-1">Your Answer:</h6>
                    <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    q.score < 70 ? 'bg-red-500/10 border border-red-500/20' : 'bg-blue-500/10'
                  }`}>
                    <h6 className={`text-xs font-semibold uppercase mb-1 ${
                      q.score < 70 ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {q.score < 70 ? '⚠️ Improvement Needed:' : '💡 AI Feedback:'}
                    </h6>
                    <p className="text-slate-200 text-sm italic">"{q.feedback}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;