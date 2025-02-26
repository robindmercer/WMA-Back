const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqDetalle",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	req_id:{
type: DataTypes.INTEGER,allowNull: false,},
	linea:{
type: DataTypes.INTEGER,allowNull: false,},
	descrip:{
type: DataTypes.STRING,allowNull: false,},
	definicion:{
type: DataTypes.INTEGER,allowNull: false,},
	size:{
type: DataTypes.INTEGER,allowNull: false,},
	show:{
type: DataTypes.STRING,allowNull: false,},
	hide:{
type: DataTypes.STRING,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
