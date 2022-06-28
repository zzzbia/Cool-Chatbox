const Users = require('./Users');
const Chat = require('./Chat');
const Chat_involvement = require('./Chat_involvement');

Users.hasMany(Chat_involvement, {
    foreignKey: 'user_id',
});

Chat_involvement.belongsTo(Users, {
    onDelete: 'CASCADE',
});

Chat.hasMany(Chat_involvement, {
    foreignKey: 'chat_id',
});

Chat_involvement.belongsTo(Chat, {
    onDelete: 'CASCADE',
});


module.exports = { Users, Chat, Chat_involvement };