const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' }
});

const interviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard', 'personalized'],
    default: 'medium' 
  },
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 100 },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);