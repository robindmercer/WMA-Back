﻿const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqDatos",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	cab_id:{
type: DataTypes.INTEGER,allowNull: false,},
	linea:{
type: DataTypes.INTEGER,allowNull: false,},
	tabla:{
type: DataTypes.INTEGER,allowNull: false,},
	dato:{
type: DataTypes.STRING,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
