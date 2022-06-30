const sequelize = require('../config/connection');
const { Chat_involvement, Chat, Users } = require('../models');

const chatSeedData = require('./chatSeedData.json');
const usersSeedData = require('./usersSeedData.json');

const userId = [1,1,3,3,2,3,2,4];
const chatId = [1,2,3,4,1,2,3,4];


const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await Users.bulkCreate(usersSeedData);
    const chat = await Chat.bulkCreate(chatSeedData);

    for (i=0; i < userId.length; i++){
    const chat_involvement = await Chat_involvement.create({
        user_id: userId[i],
        chat_id: chatId[i],
    });
    }

    process.exit(0);
};

seedDatabase();
