const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar Rutas
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');
const saleRoutes = require('./routes/saleRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardController = require('./controllers/dashboardController');
const { verifyToken } = require('./middleware/authMiddleware');

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Registrar Rutas
app.use('/api/auth', authRoutes);

// Proteger todas las rutas siguientes
app.use('/api/categorias', verifyToken, categoryRoutes);
app.use('/api/productos', verifyToken, productRoutes);
app.use('/api/clientes', verifyToken, clientRoutes);
app.use('/api/ventas', verifyToken, saleRoutes);
app.get('/api/dashboard/stats', verifyToken, dashboardController.getStats);

module.exports = app;
