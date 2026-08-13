require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("✅ Database connected!");
  await User.deleteMany({});
  console.log("🗑️ Purane saare corrupt users delete ho gaye!");
  process.exit();
}).catch(err => {
  console.log("❌ Error:", err);
});