const { Product, Category } = require('../models');

// Obtener todos los productos (incluyendo la categoria)
const getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

// Crear un nuevo producto
const create = async (req, res) => {
  try {
    const { name, description, price, stock, minStock, categoryId } = req.body;
    
    // Validaciones basicas
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Nombre, precio y categoria son obligatorios' });
    }

    const newProduct = await Product.create({
      name, description, price, stock, minStock, categoryId
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, minStock, categoryId } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.update({ name, description, price, stock, minStock, categoryId });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
};

module.exports = { getAll, create, update, remove };
