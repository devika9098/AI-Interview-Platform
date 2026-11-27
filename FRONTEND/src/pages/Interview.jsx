import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { saveInterview } from '../services/api';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const roundType = location.state?.roundType || 'Technical Interview';
  const topic = location.state?.topic || 'General';
  const companyName = location.state?.companyName || 'Tech Company';
  
  const [upcomingQuestion, setUpcomingQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(`Explain the core concepts of ${topic} and how you have applied them in your projects.`);
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [nextDifficulty, setNextDifficulty] = useState('Medium');
  const [allAnswers, setAllAnswers] = useState([]);
  const [questionCount, setQuestionCount] = useState(1);
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const generateUniqueQuestion = (count, currentTopic, diff) => {
    const timestamp = Date.now().toString().slice(-4);
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    const angles = ["security", "performance", "scalability", "memory management", "database integration", "error handling", "user experience", "API design"];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return `Q${count} [ID:${randomId}-${timestamp}]: (${diff} Level) How does ${randomAngle} affect the implementation of ${currentTopic} in a real-world scenario at ${companyName}?`;
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setAnswer(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      if (!isCameraOn) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        toast.error("Camera access denied. Please allow camera permissions.");
        setIsCameraOn(false);
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraOn]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Sorry, your browser does not support voice recognition. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    return () => {
      if (recognition && isListening) recognition.stop();
    };
  }, [recognition, isListening]);

  const speakQuestion = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isSubmitted && currentQuestion) {
      const timer = setTimeout(() => {
        speakQuestion(currentQuestion);
      }, 600);
      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }
  }, [currentQuestion, isSubmitted, isMuted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer.trim() === '') {
      toast.error('Please write or speak an answer before submitting!');
      return;
    }
    setIsEvaluating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/interview/evaluate',
        {
          currentQuestion,
          userAnswer: answer,
          difficulty: nextDifficulty,
          topic,
          companyName,
          questionCount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { score: aiScore, feedback: aiFeedback, nextDifficulty: newDiff } = response.data;
      
      setScore(aiScore);
      setFeedback(aiFeedback);
      setNextDifficulty(newDiff);
      
      const nextQ = generateUniqueQuestion(questionCount + 1, topic, newDiff);
      setUpcomingQuestion(nextQ); 
      setAllAnswers(prev => [...prev, { question: currentQuestion, answer, score: aiScore, feedback: aiFeedback }]);
      setIsSubmitted(true);

    } catch (error) {
      console.error('AI Evaluation failed:', error);
      toast.error('Failed to get AI feedback. Moving to next question anyway.');
      
      const nextQ = generateUniqueQuestion(questionCount + 1, topic, nextDifficulty);
      setUpcomingQuestion(nextQ);
      setAllAnswers(prev => [...prev, { question: currentQuestion, answer, score: 50, feedback: "Evaluated locally due to network error." }]);
      setIsSubmitted(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (questionCount >= 5) {
      finishInterview();
    } else {
      setCurrentQuestion(upcomingQuestion);
      setAnswer('');
      setIsSubmitted(false);
      setQuestionCount(prev => prev + 1);
    }
  };

  const finishInterview = async () => {
    try {
      const totalScore = allAnswers.reduce((sum, item) => sum + item.score, 0);
      const interviewData = {
        answers: allAnswers,
        totalScore: totalScore,
        maxScore: 500,
        difficulty: 'medium'
      };
      await saveInterview(interviewData);
      toast.success(`Interview Complete & Saved! Total Score: ${totalScore}/500`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save interview:', error);
      toast.error('Interview finished, but failed to save to database.');
      navigate('/dashboard');
    }
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview? Your progress will not be saved.')) {
      navigate('/dashboard');
    }
  };

  const getDifficultyColor = (level) => {
    if (level === 'Easy') return 'text-green-300 bg-green-500/20 border-green-500/30';
    if (level === 'Hard') return 'text-red-300 bg-red-500/20 border-red-500/30';
    return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/dashboard')}>
          AI Interview Platform
        </h1>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(nextDifficulty)}`}>
            {nextDifficulty}
          </span>
          <span className="text-sm text-slate-400">Question {questionCount} of 5</span>
          <button onClick={handleEndInterview} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition">
            End Interview
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(questionCount / 5) * 100}%` }}></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl relative">
        <div className="absolute top-4 right-4 z-20">
          {isCameraOn ? (
            <div className="relative group">
              <video ref={videoRef} autoPlay playsInline muted className="w-32 h-24 bg-slate-900 rounded-lg border-2 border-slate-600 object-cover shadow-lg transform scale-x-[-1]" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-slate-900"></div>
              <button onClick={() => setIsCameraOn(false)} className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"></button>
            </div>
          ) : (
            <button onClick={() => setIsCameraOn(true)} className="w-32 h-24 bg-slate-900 rounded-lg border-2 border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition shadow-lg">
               <span className="text-xs font-medium mt-1">Enable Camera</span>
            </button>
          )}
        </div>

        <div className="mb-6 pt-2">
          <div className="flex flex-col items-center mb-6">
            <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              <img src="/robot1.png" alt="AI Interviewer" className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 1)) brightness(1.1)' }} />
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-blue-300">AI Interviewer</h2>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition">
                {isMuted ? '🔇' : ''}
              </button>
            </div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
            <p className="text-lg text-slate-200 leading-relaxed font-semibold">{currentQuestion}</p>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Your Answer (Type or Speak)</label>
              <div className="relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 outline-none resize-none transition pr-12"
                  placeholder="Type your answer here or click the mic to speak..."
                />
                <button type="button" onClick={toggleListening} className={`absolute right-3 top-3 p-2 rounded-full transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  🎙️
                </button>
              </div>
              {isListening && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Listening... Speak now!
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isEvaluating} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isEvaluating ? 'AI is evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold text-green-400">Answer Evaluated!</h3>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">AI Feedback:</h4>
                <p className="text-slate-300 text-sm italic">"{feedback}"</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">Score: {score}/100</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-blue-400 font-semibold">Next Difficulty: {nextDifficulty}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => { setIsSubmitted(false); setAnswer(''); }} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition">
                Retry This Question
              </button>
              <button onClick={handleNext} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition">
                {questionCount < 5 ? 'Next Question ️' : 'Finish Interview & Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;