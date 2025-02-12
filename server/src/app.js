const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const axios = require('axios')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerFile = require('../swagger-output.json');
const logger = require('./config/logger.js')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tattoo API',
      version: '1.0.0',
    },
  },
  apis: [`./src/routes/*.js`], // Rutas de tu aplicación
};



const swaggerSpec = swaggerJsDoc(options);

require('./db.js');

const server = express();

server.name = 'API';
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  logger.info(`${req.method} ${req.url}`);
  next();
});




server.use('/', routes); 
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});
/*
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentación',
    description: 'Documentación de la API generada automáticamente',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [`./src/routes/*.js`]; // Archivo principal donde defines tus rutas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); // Tu archivo principal de la aplicación
});
*/
module.exports = server

