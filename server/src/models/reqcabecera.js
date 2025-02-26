const { DataTypes, Sequelize } = require("sequelize");
const { Compania } = require("./compania");
 
module.exports = (sequelize) => {
   sequelize.define("reqCabecera",
{
	id:{
type: DataTypes.INTEGER,
primaryKey:  true,
            autoIncrement: true,
            allowNull: false,
},
	req_id:{
type: DataTypes.INTEGER,allowNull: false,},
	descrip:{
type: DataTypes.STRING,allowNull: false,},
	fecha:{
type: DataTypes.DATE,allowNull: false,},
	user:{
type: DataTypes.STRING,allowNull: false,},
	status:{
type: DataTypes.INTEGER,allowNull: false,},
},
{ timestamps: false, freezeTableName: true }
);
};
