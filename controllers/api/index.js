const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const chatRoutes = require('./chatRoutes');

router.use('/users', usersRoutes);
router.use('/chat', chatRoutes);

module.exports = router;