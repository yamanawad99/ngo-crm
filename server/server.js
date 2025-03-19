const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Define Routes
// Import routes
const authRoutes = require('./src/routes/authRoutes');
const donorRoutes = require('./src/routes/donorRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const sponsorshipRoutes = require('./src/routes/sponsorshipRoutes');
const volunteerRoutes = require('./src/routes/volunteerRoutes');
const userRoutes = require('./src/routes/userRoutes');
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/users', userRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

