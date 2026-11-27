exports.evaluateAnswer = async (req, res) => {
  try {
    const userAnswer = req.body.userAnswer || req.body.answer || "";
    const difficulty = req.body.difficulty || "Medium";
    const topic = req.body.topic || "General";
    const companyName = req.body.companyName || "Tech Company";
    const qCount = req.body.questionCount || 1;

    let score = 50;
    if (userAnswer.length > 40) score += 20;
    if (userAnswer.length > 80) score += 15;
    if (score > 100) score = 100;

    let nextDifficulty = difficulty;
    if (score >= 80) nextDifficulty = 'Hard';
    else if (score < 60) nextDifficulty = 'Easy';

    let feedback = "Good attempt. Try to add more technical depth.";
    if (score >= 85) feedback = "Excellent answer! Very clear.";
    if (score < 60) feedback = "Needs improvement. Focus on core concepts.";

    const randomId = Math.floor(Math.random() * 9000) + 1000;
    let nextQuestion = "";
    
    if (nextDifficulty === 'Hard') {
      nextQuestion = `Q${qCount + 1} [ID:${randomId}]: Advanced Level - How would you optimize ${topic} for a large-scale system at ${companyName}?`;
    } else if (nextDifficulty === 'Easy') {
      nextQuestion = `Q${qCount + 1} [ID:${randomId}]: Basic Level - Explain ${topic} with a simple daily life example.`;
    } else {
      nextQuestion = `Q${qCount + 1} [ID:${randomId}]: Medium Level - What are the pros and cons of using ${topic} in modern development?`;
    }

    res.json({ score, feedback, nextDifficulty, nextQuestion });

  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};