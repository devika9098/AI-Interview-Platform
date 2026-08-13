const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const wordCount = answer.trim().split(/\s+/).length;
    const lowerAnswer = answer.toLowerCase();

    let score = 3; 
    let feedback = "";
    if (wordCount < 15) {
      score = 2;
      feedback = "Your answer is too short. Please provide more details, explain the 'how' and 'why', and give examples to demonstrate your understanding.";
    } 
    else if (wordCount < 30) {
      score = 5;
      feedback = "Decent attempt, but lacks depth. Try to explain the core concepts more clearly and avoid technical inaccuracies. Add real-world examples.";
    } 
   
    else {
      const positiveKeywords = ['react', 'component', 'state', 'props', 'hook', 'use', 'function', 'example', 'project', 'experience', 'api', 'dom', 'virtual', 'library', 'javascript'];
      const matchedKeywords = positiveKeywords.filter(keyword => lowerAnswer.includes(keyword));
      
      score = 5 + matchedKeywords.length; 
      score = Math.min(10, score); 

      if (score >= 8) {
        feedback = "Excellent answer! You covered the key concepts with great clarity, used correct technical terminology, and provided good depth.";
      } else {
        feedback = "Good answer! You have a basic understanding, but try to be more specific with technical terms and add practical examples from your projects.";
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ score, feedback });

  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ message: "Failed to evaluate answer" });
  }
};

module.exports = { evaluateAnswer };