const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');

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
const path = require("path");
// Load environment variables
dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173", // Your frontend port
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());

app.use(session({
  secret: 'cybergenie-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());


// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/learnzone', learnzoneRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resource-progress', resourceProgressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/facts', factRoutes );
app.use('/api/user', userRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", certificateRoutes)
app.use('/api/badge', badgeRoutes);
app.use("/badges", express.static(path.join(__dirname, "public/badges")));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live!" });
});
 
// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

