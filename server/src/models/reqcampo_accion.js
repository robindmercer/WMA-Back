const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqcampo_accion",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	status:{
type: DataTypes.INTEGER,allowNull: false,},
	campo:{
type: DataTypes.INTEGER,allowNull: false,},
	accion:{
type: DataTypes.INTEGER,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
