const Progress = require('../models/Progress');

exports.getProgress = async (req, res) => {
  try {
    const { company } = req.params;
    
    const userId = req.user ? req.user.id : '650000000000000000000001'; 
    
    const progressData = await Progress.find({ userId, company });
    res.json(progressData);
  } catch (error) {
    console.error("GET PROGRESS ERROR:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { company, topic, isCompleted } = req.body;
    
    const userId = req.user ? req.user.id : '650000000000000000000001';
    
    let progress = await Progress.findOne({ userId, company, topic });
    
    if (progress) {
      progress.isCompleted = isCompleted;
      await progress.save();
    } else {
      progress = new Progress({
        userId,
        company,
        topic,
        isCompleted
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    console.error("UPDATE PROGRESS ERROR:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};