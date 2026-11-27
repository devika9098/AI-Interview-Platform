const express = require('express');
const Interview = require('../models/Interview');
const { protectRoute } = require('../middleware/authMiddleware');
const { evaluateAnswer } = require('../controllers/interviewController');
const router = express.Router();

router.post('/evaluate', protectRoute, evaluateAnswer);

router.post('/save', protectRoute, async (req, res) => {
  try {
    const { answers, totalScore, maxScore, difficulty } = req.body;
    
    // FOOLPROOF FIX: Agar frontend se 'Aptitude' ya kuch bhi galat aaye, toh usko 'medium' kar do
    let validDifficulty = 'medium';
    if (difficulty && typeof difficulty === 'string') {
      const lowerDiff = difficulty.toLowerCase();
      if (lowerDiff === 'easy' || lowerDiff === 'medium' || lowerDiff === 'hard') {
        validDifficulty = lowerDiff;
      }
    }

    const newInterview = new Interview({
      userId: req.user ? req.user.id : req.userId,
      answers,
      totalScore,
      maxScore,
      difficulty: validDifficulty // Ab ye hamesha valid hoga
    });

    await newInterview.save();
    
    res.status(201).json({ 
      message: 'Interview saved successfully',
      interview: newInterview 
    });
  } catch (error) {
    console.error('Save interview error:', error);
    res.status(500).json({ message: 'Failed to save interview', error: error.message });
  }
});

router.get('/history', protectRoute, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.userId;
    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

router.get('/stats', protectRoute, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.userId;
    const interviews = await Interview.find({ userId });
    
    const totalInterviews = interviews.length;
    const averageScore = totalInterviews > 0 
      ? Math.round(interviews.reduce((sum, i) => sum + (i.totalScore / i.maxScore * 100), 0) / totalInterviews)
      : 0;
      
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const nextDate = new Date(checkDate);
      nextDate.setDate(checkDate.getDate() + 1);
      
      const hasInterview = interviews.some(int => {
        const intDate = new Date(int.createdAt || int.completedAt);
        return intDate >= checkDate && intDate < nextDate;
      });
      
      if (hasInterview) streak++;
      else if (i > 0) break;
    }

    res.status(200).json({
      totalInterviews,
      averageScore,
      currentStreak: streak
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;