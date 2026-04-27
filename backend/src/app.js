const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const principalRoutes = require('./routes/principalRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors());
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/content', teacherRoutes); 
app.use('/api/admin/content', principalRoutes);
app.use('/api/content', publicRoutes); 

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
