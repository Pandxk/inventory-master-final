const { Sale, SaleDetail, Product, sequelize } = require('../models');

// Crear una nueva venta con transaccion
const create = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { clientId, items } = req.body; // items: [{ productId, quantity }]

    if (!clientId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Cliente e items son obligatorios' });
    }

    // 1. Crear la cabecera de la venta
    const sale = await Sale.create({ clientId, total: 0 }, { transaction: t });

    let totalVenta = 0;

    // 2. Procesar cada item
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
      }

      // Calcular subtotal
      const subtotal = product.price * item.quantity;
      totalVenta += subtotal;

      // Crear el detalle
      await SaleDetail.create({
        saleId: sale.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: subtotal
      }, { transaction: t });

      // Restar stock
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // 3. Actualizar el total de la venta
    sale.total = totalVenta;
    await sale.save({ transaction: t });

    // Confirmar transaccion
    await t.commit();

    res.status(201).json({ 
      message: 'Venta registrada con exito', 
      saleId: sale.id, 
      total: totalVenta 
    });

  } catch (error) {
    // Si algo falla, deshacer todo
    await t.rollback();
    res.status(500).json({ 
      message: 'Error al procesar la venta', 
      error: error.message 
    });
  }
};

// Obtener todas las ventas
const getAll = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: ['client', 'details'],
      order: [['createdAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
};

module.exports = { create, getAll };
