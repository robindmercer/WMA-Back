require("dotenv").config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE, DB_PORT } = process.env;

const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    {
       logging: false, // set to console.log to see the raw SQL queries
       native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    }
 );
 // Verifica la conexión
 async function checkConnection() {
   try {
     await sequelize.authenticate();
     console.log('Conexión a la base de datos establecida');
   } catch (error) {
     console.error('Error al conectar con la base de datos:', error);
   }
 }

 checkConnection();
 // Exporta la instancia de Sequelize
 module.exports = { sequelize };
 