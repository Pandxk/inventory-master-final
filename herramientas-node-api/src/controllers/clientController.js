const { Client } = require('../models');

// Obtener todos los clientes
const getAll = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error });
  }
};

// Crear un nuevo cliente
const create = async (req, res) => {
  try {
    const { identification, firstName, lastName, email, phone, address } = req.body;
    
    if (!identification || !firstName || !lastName) {
      return res.status(400).json({ message: 'Identificacion, nombres y apellidos son obligatorios' });
    }

    const newClient = await Client.create({
      identification, firstName, lastName, email, phone, address
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente', error });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { identification, firstName, lastName, email, phone, address } = req.body;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
    await client.update({ identification, firstName, lastName, email, phone, address });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cliente', error });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
    await client.destroy();
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente', error });
  }
};

module.exports = { getAll, create, update, remove };
