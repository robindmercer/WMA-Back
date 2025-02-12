// auth.js
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { Sequelize } = require('sequelize');
const { SECRET_KEY,expiresIn } = process.env;

const generateToken = (user) => {
  /*const payload = {
    sub: ({
        name: user.name,
        id: user._id
    }),
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + expiresIn
  };
  */
  const payload = {
    id: user.id,
    compania: user.companyId,
    nombre:user.nombre,
    perfiles: user.perfiles
  };
  const secretKey = SECRET_KEY; // Reemplaza con tu clave secreta
  const options = {
    expiresIn: '8h', // Token expira en 1 hora
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};
const authenticate = async (req, res, next) => {
  
  const authHeader = await req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const token = authHeader.split(' ')[1];
  const secretKey = SECRET_KEY; // Reemplaza con tu clave secreta
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    // console.log(req.user)
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar los perfiles del usuario
function authorizeProfiles(requiredProfiles) {
  return (req, res, next) => {
    
    const userProfiles = req.user.perfiles.map(profile => profile.nombre);
    const hasRequiredProfile = requiredProfiles.some(profile => userProfiles.includes(profile));
    // console.log(hasRequiredProfile)
    if (!hasRequiredProfile) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
}


module.exports = { generateToken, authenticate,authorizeProfiles };
