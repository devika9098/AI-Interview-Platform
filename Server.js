const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes Import karo
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interview', interviewRoutes);

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Interview Platform API is Running! 🚀',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      interviewHistory: 'GET /api/interview/history',
      resumeUpload: 'POST /api/resume/upload' 
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});