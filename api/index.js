// api/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allowing local and common origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
      // For Vercel, we allow any vercel.app subdomain or just return true if it's from the same site.
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Database Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
      bufferCommands: false, // Disable buffering so we get errors immediately
    });
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    throw err; 
  }
};

// Vercel middleware should be BEFORE routes
app.use(async (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    try {
      await connectDB();
      next();
    } catch (err) {
      return res.status(500).json({ 
        message: 'Database connection failed', 
        error: err.message 
      });
    }
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Catch-all JSON 404
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: `Route ${req.originalUrl} not found on this server` });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server due to DB connection error');
  });
}

export default app;
