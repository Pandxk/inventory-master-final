const { Category, Product, Client, User } = require('./models');
const { sequelize } = require('./config/database');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });

    // User ucacue
    const hashedPw = await bcrypt.hash('ucacue', 10);
    await User.findOrCreate({
      where: { email: 'ucacue' },
      defaults: {
        name: 'UCACUE Admin',
        email: 'ucacue',
        password: hashedPw,
        role: 'admin'
      }
    });

    // Categories
    const categoryNames = [
      { name: 'Herramientas Eléctricas', description: 'Taladros, sierras y más' },
      { name: 'Herramientas Manuales', description: 'Martillos, destornilladores' },
      { name: 'Medición', description: 'Cintas métricas, niveles' },
      { name: 'Seguridad', description: 'Cascos, guantes, gafas' },
      { name: 'Almacenamiento', description: 'Cajas de herramientas, estantes' }
    ];

    for (const cat of categoryNames) {
      await Category.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }

    console.log('Usuario y datos base listos.');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    process.exit(1);
  }
};

seed();
