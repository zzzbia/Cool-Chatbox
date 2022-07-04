const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Chat extends Model {}

Chat.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		chat_content: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		chat_host_username: {
			type: DataTypes.STRING,
		},
		chat_partner_username: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "chat",
	}
);

module.exports = Chat;
