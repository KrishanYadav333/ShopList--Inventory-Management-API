const express = require('express');
const env = require('./config/env');
const { errorHandler } = require('./middlewares/error');
const productRoutes = require('./routes/products.routes');

const app = express();

// Core middleware
app.use(express.json());

// Routes
app.use('/products', productRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Central error handler (must be last)
app.use(errorHandler);

// Start server with error handling
const server = app.listen(env.PORT, () => {
  console.log(`ShopList API running on port ${env.PORT}`);
  console.log(`Health check: http://localhost:${env.PORT}/health`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${env.PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});