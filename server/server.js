const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load environment variables
dotenv.config();

// Import routes
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- Middleware Configuration ---
// 1. CORS: Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true,
}));

// 2. Body Parsers: To parse incoming request bodies
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// 3. Static Files: Serve uploaded images from the 'public' folder
app.use(express.static('public'));

// 4. Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-very-strong-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// --- API Routes ---
// Must come AFTER the middleware configuration
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));