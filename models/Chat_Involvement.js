const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Chat_Involvement extends Model {}

Chat_Involvement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
      },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'chat',
            key: 'id'
        } 
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'chat involvement',
  }
);

module.exports = Chat_Involvement;