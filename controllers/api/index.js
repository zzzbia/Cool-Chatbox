const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const chatRoutes = require('./chatRoutes');
const chatInvolvementRoutes = require('./chatInvolvementRoutes');

router.use('/users', usersRoutes);
router.use('/chat', chatRoutes);
router.use('/chatInvolvement', chatInvolvementRoutes);

module.exports = router;