const sequelize = require('../config/connection');
const { Chat_involvement, Chat, Users } = require('../models');

const chatSeedData = require('./chatSeedData.json');
const usersSeedData = require('./usersSeedData.json');

const id1 = [1,1,3,3];
const id2 = [2,3,2,4]

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await Users.bulkCreate(usersSeedData);
    const chat = await Chat.bulkCreate(chatSeedData);

    for (i=0; i < id1.length; i++){
    const chat_involvement = await Chat_involvement.create({
        user_id: id1[i],
        chat_id: id2[i],
    });
    }

    process.exit(0);
};

seedDatabase();
