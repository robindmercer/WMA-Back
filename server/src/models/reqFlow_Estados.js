const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqFlow_Estados",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	req_id:{
type: DataTypes.INTEGER,allowNull: false,},
	est_act:{
type: DataTypes.INTEGER,allowNull: false,},
	sect_act:{
type: DataTypes.INTEGER,allowNull: false,},
	est_dest:{
type: DataTypes.INTEGER,allowNull: false,},
	sect_dest:{
type: DataTypes.INTEGER,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
