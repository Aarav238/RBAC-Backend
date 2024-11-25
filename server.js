// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  optionsSuccessStatus: 200,
  credentials: true,
}));

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize({
  replaceWith: '_',
}));

// Logging Middleware
app.use(morgan('combined', { stream: logger.stream }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// Body Parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/protected', require('./routes/protected'));

// Error Handling Middleware
app.use(errorHandler);

// Default Route
app.get('/', (req, res) => {
  res.send('Authentication and RBAC System is Running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
