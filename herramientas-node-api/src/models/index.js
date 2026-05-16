const { sequelize } = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Client = require('./Client');
const Sale = require('./Sale');
const SaleDetail = require('./SaleDetail');

// Relaciones
// Categoria - Producto (1:N)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Cliente - Venta (1:N)
Client.hasMany(Sale, { foreignKey: 'clientId', as: 'sales' });
Sale.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Venta - Detalle Venta (1:N)
Sale.hasMany(SaleDetail, { foreignKey: 'saleId', as: 'details' });
SaleDetail.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });

// Producto - Detalle Venta (1:N)
Product.hasMany(SaleDetail, { foreignKey: 'productId', as: 'saleDetails' });
SaleDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Usuario - Venta (1:N) (Usuario que registra la venta)
User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Client,
  Sale,
  SaleDetail
};
