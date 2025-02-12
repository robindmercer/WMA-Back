/*
  Main index File 
*/
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { deployFirstData }= require('./src/loader/deploy.js');
const port = process.env.PORT ||3001
// Syncing all the models at once.
//conn.sync({ force: true }).then(() => {
//   refLoad()

conn.sync({alter:true,logging:console.log}).then(() => {
  deployFirstData()
  const serverProcess = server.listen(port, () => {
    console.log(`Server listening at ${port}`); // eslint-disable-line no-console
  });
// Gracefully handle SIGINT and SIGTERM
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received. Closing HTTP server...`);
  serverProcess.close(() => {
      console.log('HTTP server closed.');
      // Exit process after server is closed
      process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
});



