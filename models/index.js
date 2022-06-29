const Users = require('./Users');
const Chat = require('./Chat');
const Chat_involvement = require('./Chat_Involvement');

Users.belongsToMany(Chat, {
    through: Chat_involvement,
    foreignKey: 'user_id',
});

Chat.belongsToMany(Users, {
    through: Chat_involvement,
    foreignKey: 'chat_id',
});

module.exports = { Users, Chat, Chat_involvement };