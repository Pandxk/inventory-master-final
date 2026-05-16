const { Product, Sale, sequelize } = require('../models');
const { Op } = require('sequelize');

const getStats = async (req, res) => {
  try {
    // 1. Total Productos
    const totalProducts = await Product.count();

    // 2. Stock Bajo (menor o igual a minStock)
    const lowStockCount = await Product.count({
      where: {
        stock: {
          [Op.lte]: sequelize.col('minStock')
        }
      }
    });

    // 3. Ventas de hoy (Suma de totales)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await Sale.sum('total', {
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    res.json({
      totalProducts,
      lowStockCount,
      todaySales: todaySales || 0
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadisticas', error: error.message });
  }
};

module.exports = { getStats };
