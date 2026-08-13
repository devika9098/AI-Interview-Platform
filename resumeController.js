const extractTextFromResume = async (req, res) => {
  try {
    console.log('--- RESUME UPLOAD STARTED ---');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    if (!req.file) {
      console.log('❌ No file received in req.file');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const extractedText = req.body.extractedText || 'No text provided';
    console.log('✅ File received:', req.file.originalname);
    console.log('📝 Text length:', extractedText.length);

    res.json({ 
      message: 'Resume uploaded successfully',
      fileName: req.file.originalname,
      extractedText: extractedText.substring(0, 500),
      textLength: extractedText.length
    });
  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({ message: 'Failed to upload resume', error: error.message });
  }
};

module.exports = { extractTextFromResume };