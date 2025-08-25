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

// Start server
app.listen(env.PORT, () => {
  console.log(`ShopList API running on port ${env.PORT}`);
});