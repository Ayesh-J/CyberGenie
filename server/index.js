const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

dotenv.config();
const app = express();

//  Proper CORS setup
app.use(cors({
  origin: "https://cyber-genie.vercel.app", // ❌ no trailing slash!
  credentials: true,
}));

//   Explicit CORS headers (helps some platforms like Railway)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://cyber-genie.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// JSON body parsing
app.use(express.json());

// Sessions (optional depending on your auth logic, usually only for cookie-based sessions)
app.use(session({
  secret: 'cybergenie-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

//  Route imports
const authRoutes = require('./routes/authRoutes');
const learnzoneRoutes = require('./routes/learnzoneRoutes');
const resourceRoutes = require('./routes/resources');
const chatbotRoutes = require("./routes/chatbot");
const progressRoutes = require("./routes/progress");
const resourceProgressRoutes = require("./routes/resourcesProgress");
const quizRoutes = require('./routes/quizRoutes');
const factRoutes = require('./routes/factRoutes');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require("./routes/adminRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

//  Use routes
app.use('/api/auth', authRoutes);
app.use('/api/learnzone', learnzoneRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resource-progress', resourceProgressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/facts', factRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificate", certificateRoutes);
app.use('/api/badge', badgeRoutes);

//  Serve static files if needed
app.use("/badges", express.static(path.join(__dirname, "public/badges")));

//  Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
