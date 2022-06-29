const router = require('express').Router();
const { Chat, Users } = require('../../models');

// route for retrieveing all chat logs
router.get('/', async (req, res) => {
    try {
        const chatsData = await Chat.findAll({include: Users});

        res.status(200).json(chatsData);

    } catch (err) {
      res.status(400).json(err);
    }
});

// route for retriving specific chat logs
router.get('/:id', async (req,res) => {
    try {
        const chatData = await Chat.findByPk(req.params.id,{include: Users});

        if (!chatData) {
            res.status(404).json({message: `No chat with ID: ${req.params.id} found`});
            return;
          };

        res.status(200).json(chatData);

    } catch (err) {
        res.status(400).json(err);
    };
});

// router.post('/send', async (req, res) => {
//   try {

//   } catch (err) {
//     res.status(400).json(err);
//   }
// });



module.exports = router;