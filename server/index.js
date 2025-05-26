const express  = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const learnzoneRoutes = require('./routes/learnzoneRoutes');
const resourceRoutes = require('./routes/resources');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Corrected routes
app.use('/api/auth', authRoutes);
app.use('/api/learnzone', learnzoneRoutes); // Handles modules AND resources

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
