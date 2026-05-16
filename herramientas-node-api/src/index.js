require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Test database connection
    await testConnection();
    
    // 2. Sync database models (creates tables if they don't exist)
    const syncAlter = process.env.DB_SYNC_ALTER === 'true';
    await sequelize.sync({ alter: syncAlter });
    console.log(`Modelos sincronizados con la base de datos (alter: ${syncAlter}).`);

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

startServer();
