require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const formaspago = require('./models/formaspago');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE,DATABASE_URL, DB_PORT } = process.env;
//postgresql://postgres:lbQDeYI6IKIDWEVd5jbu@containers-us-west-36.railway.app:7945/railway
const sequelize = new Sequelize(`${DATABASE_URL}`, {
//const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

 console.log('sequelize: ', sequelize.models);
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Porcentaje,Agenda,Ganancia,User, Compania,Estadousuario,Perfilusuario,Producto,Estadocompania,Estadoproducto,Cliente,Insumo,Adicional,Servicio,Servicioinsumo,Formaspago,
        Costo,
        Presupuesto,Presupuestoinsumo,Presupuestoservicio,Presupuestoproducto,
        Compra,Compraproducto,Comprainsumo } = sequelize.models;
// Aca vendrian las relaciones
// Relaciones One to One 

User.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(User, { foreignKey: 'companyId',sourceKey:'id' });
User.belongsTo(Estadousuario, { foreignKey: 'estadoId',targetKey:'id' });
Estadousuario.hasMany(User, { foreignKey: 'estadoId',sourceKey:'id' });
User.belongsToMany(Perfilusuario, {
  through: 'userperfilrel',
  foreignKey: 'userId',
  otherKey: 'perfilId',
});
Perfilusuario.belongsToMany(User, {
  through: 'userperfilrel',
  foreignKey: 'perfilId',
  otherKey: 'userId',
});
Producto.belongsTo(Ganancia, { foreignKey: 'porcentajeganancia',targetKey:'id_primary' });      
Ganancia.hasMany(Producto, { foreignKey: 'porcentajeganancia',sourceKey:'id_primary' });
Producto.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Producto.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });      
Estadoproducto.hasMany(Producto, { foreignKey: 'cod_status',sourceKey:'id' });
Compania.hasMany(Producto, { foreignKey: 'companyId',sourceKey:'id' });
Compania.hasMany(Cliente, { foreignKey: 'companyId',sourceKey:'id' });
Compania.belongsTo(Estadocompania, { foreignKey: 'cod_status',targetKey:'id' });
Estadocompania.hasMany(Compania, { foreignKey: 'cod_status',sourceKey:'id' });
Cliente.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Insumo.belongsTo(Ganancia, { foreignKey: 'porcentajeganancia',targetKey:'id_primary' });      
Ganancia.hasMany(Insumo, { foreignKey: 'porcentajeganancia',sourceKey:'id_primary' });
Insumo.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });
Estadoproducto.hasMany(Insumo, { foreignKey: 'cod_status',sourceKey:'id' });
Insumo.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Insumo, { foreignKey: 'companyId',sourceKey:'id' });
Servicio.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });
Estadoproducto.hasMany(Servicio, { foreignKey: 'cod_status',sourceKey:'id' });
Servicio.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Servicio, { foreignKey: 'companyId',sourceKey:'id' });

Costo.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });
Estadoproducto.hasMany(Costo, { foreignKey: 'cod_status',sourceKey:'id' });
Costo.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Costo, { foreignKey: 'companyId',sourceKey:'id' });

Costo.belongsTo(Servicio, { foreignKey: 'serv_id',sourceKey:'id_primary' });

Servicio.belongsToMany(Insumo, {
  through: 'servicioinsumo',
  foreignKey: 'servicioIdPrimary',
  otherKey: 'insumoIdPrimary',
});
Insumo.belongsToMany(Servicio, {
  through: 'servicioinsumo',
  foreignKey: 'insumoIdPrimary',
  otherKey: 'servicioIdPrimary',
});
Servicioinsumo.belongsTo(Servicio,{ foreignKey: 'servicioIdPrimary',sourceKey:'id_primary' })
Servicioinsumo.belongsTo(Insumo,{ foreignKey: 'insumoIdPrimary',sourceKey:'id_primary' })
/*Insumo.hasMany(Servicio_insumo);
Servicio_insumo.belongsTo(Insumo);
*/
Formaspago.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Formaspago.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });      
Estadoproducto.hasMany(Formaspago, { foreignKey: 'cod_status',sourceKey:'id' });
Compania.hasMany(Formaspago, { foreignKey: 'companyId',sourceKey:'id' });

Ganancia.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });      
Estadoproducto.hasMany(Ganancia, { foreignKey: 'cod_status',sourceKey:'id' });

Ganancia.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Ganancia, { foreignKey: 'companyId',sourceKey:'id' });
//Todas las relaciones de presupuesto
Adicional.belongsTo(Presupuesto, {foreignKey:'presupuestoId',targetKey:'id_primary'})
Presupuesto.hasMany(Adicional, {foreignKey:'presupuestoId',sourceKey:'id_primary'} )

Presupuesto.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });      
Estadoproducto.hasMany(Presupuesto, { foreignKey: 'cod_status',sourceKey:'id' });
Presupuesto.belongsTo(Formaspago, { foreignKey: 'tipoPago',targetKey:'id_primary' });      
Formaspago.hasMany(Presupuesto, { foreignKey: 'tipoPago',sourceKey:'id_primary' });

Presupuesto.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Presupuesto, { foreignKey: 'companyId',sourceKey:'id' });
Presupuesto.belongsTo(Cliente, { foreignKey: 'clienteId',targetKey:'id_primary' });
Cliente.hasMany(Presupuesto, { foreignKey: 'clienteId',sourceKey:'id_primary' });
Presupuesto.belongsTo(User, { foreignKey: 'userId',targetKey:'id' });
User.hasMany(Presupuesto, { foreignKey: 'userId',sourceKey:'id' });

Presupuesto.belongsToMany(Insumo, {
  through: 'presupuestoinsumo',
  foreignKey: 'presupuestoIdPrimary',
  otherKey: 'insumoIdPrimary',
  onDelete: 'CASCADE',
});
Insumo.belongsToMany(Presupuesto, {
  through: 'presupuestoinsumo',
  foreignKey: 'insumoIdPrimary',
  otherKey: 'presupuestoIdPrimary',
});
Presupuestoinsumo.belongsTo(Presupuesto,{ foreignKey: 'presupuestoIdPrimary',sourceKey:'id_primary' })
Presupuestoinsumo.belongsTo(Insumo,{ foreignKey: 'insumoIdPrimary',sourceKey:'id_primary' })

Presupuesto.belongsToMany(Servicio, {
  through: 'presupuestoservicio',
  foreignKey: 'presupuestoIdPrimary',
  otherKey: 'servicioIdPrimary',
  onDelete: 'CASCADE',
});
Servicio.belongsToMany(Presupuesto, {
  through: 'presupuestoservicio',
  foreignKey: 'servicioIdPrimary',
  otherKey: 'presupuestoIdPrimary',
});
Presupuestoservicio.belongsTo(Presupuesto,{ foreignKey: 'presupuestoIdPrimary',sourceKey:'id_primary' })
Presupuestoservicio.belongsTo(Servicio,{ foreignKey: 'servicioIdPrimary',sourceKey:'id_primary' })

Presupuesto.belongsToMany(Producto, {
  through: 'presupuestoproducto',
  foreignKey: 'presupuestoIdPrimary',
  otherKey: 'productoIdPrimary',
  onDelete: 'CASCADE',
});
Producto.belongsToMany(Presupuesto, {
  through: 'presupuestoproducto',
  foreignKey: 'productoIdPrimary',
  otherKey: 'presupuestoIdPrimary',
});
Presupuestoproducto.belongsTo(Presupuesto,{ foreignKey: 'presupuestoIdPrimary',sourceKey:'id_primary' })
Presupuestoproducto.belongsTo(Producto,{ foreignKey: 'productoIdPrimary',sourceKey:'id_primary' })

Agenda.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Agenda, { foreignKey: 'companyId',sourceKey:'id' });

Porcentaje.belongsTo(User, { as:'usuario', foreignKey: 'usr_id'});
Porcentaje.belongsTo(User, { as:'profesional', foreignKey: 'usr_serv'});

// Porcentaje.belongsTo(Servicio, { as:'servicio', foreignKey: 'id',targetKey:'serv_id' });
Porcentaje.belongsTo(Servicio, { foreignKey: 'serv_id',targetKey:'id_primary' });
Servicio.hasMany(Porcentaje, { foreignKey: 'serv_id',sourceKey:'id_primary' });

//***********************/
// COMPRAS
//***********************/

Compra.belongsTo(Estadoproducto, { foreignKey: 'cod_status',targetKey:'id' });
Estadoproducto.hasMany(Compra, { foreignKey: 'cod_status',sourceKey:'id' });
Compra.belongsTo(Compania, { foreignKey: 'companyId',targetKey:'id' });
Compania.hasMany(Compra, { foreignKey: 'companyId',sourceKey:'id' });

Compra.belongsToMany(Producto, {
  through: 'compraproducto',
  foreignKey: 'compraIdPrimary',
  otherKey: 'productoIdPrimary',
  onDelete: 'CASCADE',
});
Producto.belongsToMany(Compra, {
  through: 'compraproducto',
  foreignKey: 'productoIdPrimary',
  otherKey: 'compraIdPrimary',
});
Compraproducto.belongsTo(Compra,{ foreignKey: 'compraIdPrimary',sourceKey:'id_primary' })
Compraproducto.belongsTo(Producto,{ foreignKey: 'productoIdPrimary',sourceKey:'id_primary' })

Compra.belongsToMany(Insumo, {
  through: 'comprainsumo',
  foreignKey: 'compraIdPrimary',
  otherKey: 'insumoIdPrimary',
  onDelete: 'CASCADE',
});
Insumo.belongsToMany(Compra, {
  through: 'comprainsumo',
  foreignKey: 'insumoIdPrimary',
  otherKey: 'compraIdPrimary',
});
Comprainsumo.belongsTo(Compra,{ foreignKey: 'compraIdPrimary',sourceKey:'id_primary' })
Comprainsumo.belongsTo(Insumo,{ foreignKey: 'insumoIdPrimary',sourceKey:'id_primary' })

/**/
//probar variables globales

//probar variables globales
function isWithinBusinessHours() {
  const now = new Date();
  const currentHour = now.getHours();

  // Verifica si la hora actual está entre las 09:00 y las 18:00
  return currentHour >= 8 && currentHour < 18;
}
const obtenerValorDolar = async function obtenerBlueValueSell() {
  try {
    if (isWithinBusinessHours()) {
    const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
    global.valorDolarActual = response.data.blue.value_sell;
    global.fechaActualizacion = Date.now
    console.log(global.valorDolarActual); // Imprime el valor de blue.value_sell
    }
  } catch (error) {
   // console.error(error); // Maneja errores
  }
}

setTimeout(obtenerValorDolar,0)
setInterval(obtenerValorDolar, 1800000);


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, Usuario } = require('./db.js');
  conn: sequelize, 
  // para importart la conexión { conn } = require('./db.js');
};
