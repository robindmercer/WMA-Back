const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqHistory",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	linea:{
type: DataTypes.INTEGER,allowNull: false,},
	observ:{
type: DataTypes.STRING,allowNull: false,},
	sector:{
type: DataTypes.INTEGER,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
