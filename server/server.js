const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express();

// Middleware
// Configure CORS to accept credentials
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's origin
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
const dbConnection = mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-very-strong-secret', // Use an env variable for this
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));