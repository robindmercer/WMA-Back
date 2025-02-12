const { User,Perfilusuario,Compania,Estadousuario,Userperfilrel} = require('../db.js');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const {validationResult } = require('express-validator');

const getAllUsers = async (req, res) => {
  try {
    const { nombre,perfil } = req.query;
    const condiciones = {};
    const condicionesPerfil = {};
    if (nombre) {
      condiciones.username = {
        [Op.like]: `%${nombre}%`
      };
    }
    condiciones.companyId = {
      [Op.eq] : req.user.companyId
    }
    if (perfil) {
      condicionesPerfil.nombre = {
        [Op.like]: `${perfil}`
      };
    }
    const users = await User.findAll({
      where: condiciones,
      attributes: {exclude: ['passwordHash']},
      include: [
        {
          model: Perfilusuario,
          where: condicionesPerfil,
          attributes:['id','nombre'],
          through: { attributes: [] }, 
        },
        {
          model: Compania,
          exclude: ['id'],
        },
        {
          model: Estadousuario,
          exclude: ['id'],
        }
    ],
    }
  );
    res.json(users);
  } catch (error) {
    
  }

};

const getUserById = async (req, res) => {
  try {
    const id = (req.params.id);
    const condiciones = {}
    condiciones.companyId = {
      [Op.eq] : req.user.companyId
    }
    condiciones.id_rank = {
      [Op.eq] : id
    }
    // const user = await User.findByPk(id.id);
    const user = await User.findOne({
      where : condiciones,
      attributes: {exclude: ['passwordHash']}
    });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(user);
    }
  } catch (error) {
    
  }

};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    const { username, email, passwordHash, companyId,perfiles,nombrecompleto } = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let companiaUsuario
      if(req.user){
        companiaUsuario = req.user.companyId
      }else{
        companiaUsuario = companyId
      }
      const maxId = await User.max('id_rank', {
        where :{
          companyId : companiaUsuario
        }
      });
      const id_rank_max = (maxId || 0) + 1;
      const user = await User.create({ id_rank: id_rank_max,username, email, passwordHash, companyId:companiaUsuario,estadoId:1,nombrecompleto });
      const condicionesPerfil = {};
      condicionesPerfil.id = {
        [Op.in] : perfiles
      }
      // Validar que los IDs de insumos existan
      const perfilesEncontrados = await Perfilusuario.findAll({
        where :condicionesPerfil
      });
     if (perfilesEncontrados.length !== perfiles.length) {
        return res.status(400).json({ message: 'Algunos perfiles no existen' });
      }
      await user.addPerfilusuario(perfilesEncontrados,{  logging: console.log});
      res.json(user);
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Fallo el alta de usuario' });
    }
  } catch (error) {
    
  }


};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
try {

  const { username, password } = req.body;
 // console.log('req.body: ', req.body);
  const user = await User.findOne(
    { 
      where: { 
        username: `${username}` 
      },
      include: [
        {
          model: Perfilusuario,
          attributes:['id','nombre'],
          through: { attributes: [] }, 
        },
        {
          model: Compania,
          exclude: ['id'],
        },
        {
          model: Estadousuario,
          exclude: ['id'],
        }
    ], 
    }
  );
  //console.log('user: ', user);
  if (!user) {
    res.status(401).json({ message: 'Usuario Inexistente' });
  } 
  if (!password) {
    res.status(401).json({ message: 'Password inválido' });
  } 
  if (!(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Credenciales inválidas' });
  } else {
    const token = jwt.sign({ id: (user.id_rank),nombre:(user.nombre),companyId:(user.companyId),perfiles:(user.perfilusuarios) }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: (user.id_rank),nombre:(user.nombre),companyId:(user.companyId),perfiles:(user.perfilusuarios) }, process.env.SECRET_KEY, { expiresIn: '1d' });
    res.json({ token,refreshToken });
  }
} catch (error) {
//  res.status(500).json({ message: 'login incorrecto' });
}

};

const getUserCompany = async (req, res) => {
  try {
    const id = (req.body);
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      const company = await user.getCompany();
      res.json(company);
    } 
  } catch (error) {
    
  }

};
const updateUser = async (req, res) => {

  const { username, email, passwordHash, estadoId,perfiles,nombrecompleto } = req.body;
  try {
 //   const id = (req.params.id);
    const condiciones = {}
    condiciones.companyId = {
      [Op.eq] : req.user.companyId
    }
    condiciones.id_rank = {
      [Op.eq] : req.params.id
    }
    // const user = await User.findByPk(id.id);
    const user = await User.findOne({
      where : condiciones,
    });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      await user.update({ username, email, passwordHash, companyId:req.user.companyId,estadoId,nombrecompleto });
      await user.getPerfilusuarios().then((perfiles) => {
        perfiles.forEach((perfil) => {
          user.removePerfilusuario(perfil.id);
        });
      })
      const condicionesPerfil = {};
      condicionesPerfil.id = {
        [Op.in] : perfiles
      }
      // Validar que los IDs de insumos existan
      const perfilesEncontrados = await Perfilusuario.findAll({
        where :condicionesPerfil
      });
     if (perfilesEncontrados.length !== perfiles.length) {
        return res.status(400).json({ message: 'Algunos perfiles no existen' });
      }
      await user.addPerfilusuario(perfilesEncontrados,{  logging: console.log});
      res.json(user);
    }
  } catch (error) {
    console.log('error: ', error);
    res.json({"msg":error});
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = (req.params.id);
    const condiciones = {}
    condiciones.companyId = {
      [Op.eq] : req.user.companyId
    }
    condiciones.id_rank = {
      [Op.eq] : id
    }
    // const user = await User.findByPk(id.id);
    const user = await User.findOne({
      where : condiciones,
    });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      await user.destroy();
      res.json({ message: 'Usuario eliminado' });
    }
  } catch (error) {
    
  }
};

const renovarToken = async (req, res) => {
  try {
    const authHeader = await req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    const refreshToken = authHeader.split(' ')[1];
  
    if (!refreshToken) {
      return res.status(401).json({ error: 'No hay token de renovación' });
    }
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    //= jwt.sign({ id: (user.id_rank),nombre:(user.nombre),companyId:(user.companyId),perfiles:(user.perfilusuarios) }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const nuevoAccessToken = jwt.sign({ id: decoded.id ,nombre: decoded.nombre, companyId: decoded.companyId,perfiles:decoded.perfiles }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
    if (!nuevoAccessToken) {
      return res.status(401).json({ error: 'Token de renovación inválido' });
    }
  
    res.json({ token: nuevoAccessToken });
  } catch (error) {
    
  }
};

const addPerfilesUsers = async (req, res) => {
      try {
      const perfilesId = req.body
      const id = (req.params.id);
      const condiciones = {}
      condiciones.companyId = {
        [Op.eq] : req.user.companyId
      }
      condiciones.id_rank = {
        [Op.eq] : id
      }
      // const user = await User.findByPk(id.id);
      const usuario = await User.findOne({
        where : condiciones,
      });
      if (!usuario) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
//      console.log(insumosIds.length)
      const condicionesPerfil = {};
      condicionesPerfil.id = {
        [Op.in] : perfilesId
      }
      // Validar que los IDs de insumos existan
      const perfilesEncontrados = await Perfilusuario.findAll({
        where :condicionesPerfil
      });
     if (perfilesEncontrados.length !== perfilesId.length) {
        return res.status(400).json({ message: 'Algunos perfiles no existen' });
      }
      await usuario.addPerfilusuario(perfilesEncontrados,{  logging: console.log});
      
      return res.json({ message: 'Relación creada con éxito' });
    } catch (error) {
      console.log(error.code)
      console.log(error.message)
      return res.status(500).json({ message: 'Error al crear relación' });
    }
}; 

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  getUserCompany,
  updateUser,
  deleteUser,
  renovarToken,
  addPerfilesUsers
};
