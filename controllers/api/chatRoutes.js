const router = require("express").Router();
const { Chat, Users, Chat_involvement } = require("../../models");

// route for retrieveing all chat logs
router.get("/", async (req, res) => {
	try {
		const chatsData = await Chat.findAll({ include: Users });

		res.status(200).json(chatsData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// route for retriving specific chat logs based on id
router.get("/:id", async (req, res) => {
	try {
		const chatData = await Chat.findByPk(req.params.id, { include: Users });

		if (!chatData) {
			res
				.status(404)
				.json({ message: `No chat with ID: ${req.params.id} found` });
			return;
		}

		res.status(200).json(chatData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Initialize a new chat object in the database to be updated with each new message
router.post("/newChat", async (req, res) => {
	// expect body like
	// {
	//   "userIdArr": [1,3]
	// }
	try {
		const newChat = await Chat.create({
			chat_content: { username: " ", chat: " " },
		});

		const userId = [req.session.user_id, req.body.chatPartnerId];
		const chatId = [newChat.id, newChat.id];

		for (i = 0; i < 2; i++) {
			const chat_involvement = await Chat_involvement.create({
				user_id: userId[i],
				chat_id: chatId[i],
			});
		}

		res.status(200).json(newChat);
	} catch (err) {
		res.status(400).json(err);
	}
});

// updates previously created chat
router.put("/:id", async (req, res) => {
	try {
		const previousData = await Chat.findByPk(req.params.id);

		if (!previousData) {
			res
				.status(404)
				.json({ message: `No chat with ID: ${req.params.id} found` });
			return;
		}

		await Chat.update(req.body, { where: { id: req.params.id } });
		const newData = await Chat.findByPk(req.params.id);

		res.status(200).json(newData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
