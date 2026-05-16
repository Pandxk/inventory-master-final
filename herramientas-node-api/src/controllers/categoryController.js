const { Category } = require('../models');

// Obtener todas las categorias
const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorias', error });
  }
};

// Crear una nueva categoria
const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const newCategory = await Category.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoria', error });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.update({ name, description });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría', error });
  }
};

module.exports = { getAll, create, update, remove };
