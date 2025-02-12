const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');


module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_rank: {
      type: DataTypes.INTEGER,
      unique: 'company_id_unique',
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    nombrecompleto: {
      type: DataTypes.STRING,
      //allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        unique: 'company_id_unique',
        references: {
          model: 'compania',
          key: 'id',
        },
      },
      estadoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'estadousuario',
          key: 'id',
        },
      },
    // Otros campos del usuario...
  });
  // Hooks para hashear la contraseña antes de guardar
  User.beforeCreate(async (user, options) => {
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  });
  User.beforeBulkCreate(async (user, options) => {
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  });
  User.beforeUpdate(async (user, options) => {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  });
  User.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  };


  return User;
};
