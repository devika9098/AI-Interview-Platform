exports.evaluateAndNextQuestion = async (req, res) => {
  try {
    const { currentQuestion, userAnswer, difficulty, topic, companyName } = req.body;

    let score = 50;
    if (userAnswer.length > 40) score += 20;
    if (userAnswer.length > 80) score += 15;
    if (userAnswer.toLowerCase().includes('example')) score += 10;
    if (score > 100) score = 100;

    let nextDifficulty = difficulty;
    if (score >= 80) {
      nextDifficulty = 'Hard';
    } else if (score < 60) {
      nextDifficulty = 'Easy';
    }

    let feedback = "Good attempt. Try to add more technical depth and real-world examples.";
    if (score >= 85) feedback = "Excellent answer! Very clear and well-structured.";
    if (score < 60) feedback = "Needs improvement. Focus on core concepts and try to be more specific.";

    let nextQuestion = "";
    
    if (nextDifficulty === 'Hard') {
      nextQuestion = `Based on your answer, explain the internal working, edge cases, and scalability of ${topic} in a production environment like ${companyName}.`;
    } else if (nextDifficulty === 'Easy') {
      nextQuestion = `Let's simplify. Can you explain the basic definition of ${topic} with a simple, everyday real-life example?`;
    } else {
      nextQuestion = `That's a fair explanation. Now, how would you optimize or improve this ${topic} concept in terms of time and space complexity?`;
    }

    res.json({
      score,
      feedback,
      nextDifficulty,
      nextQuestion
    });

  } catch (error) {
    console.error("AI Evaluation Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};