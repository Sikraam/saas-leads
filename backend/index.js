const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Rate limiting - auth routes (max 10 requests/15min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' }
});

// Rate limiting - general (max 100 requests/15min)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes' }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', generalLimiter, require('./routes/leadsRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'API SaaS Leads — Server running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});