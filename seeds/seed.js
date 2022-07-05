const sequelize = require('../config/connection');
const { Users } = require('../models');

const usersSeedData = require('./usersSeedData.json');



const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await Users.bulkCreate(usersSeedData);

    process.exit(0);
};

seedDatabase();
