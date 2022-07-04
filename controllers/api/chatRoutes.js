const router = require("express").Router();
const { Op } = require("sequelize");

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

// #TODO: route for deleting chat by id if user is in the chat
router.delete("/:id", async (req, res) => {
	try {
		const chatData = await Chat.findByPk(req.params.id);

		// if user is

		res.status(200).json(chatData);
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
	try {
		if (!req.session.logged_in || !req.session.user_id) {
			return res.status(401).json({ message: "You are not logged in" });
		}

		if (!req.body.chatPartnerId) {
			res.status(400).json({ message: "No chat partner id provided" });
			return;
		}

		if (req.body.chatPartnerId === req.session.user_id) {
			res.status(400).json({ message: "You cannot chat with yourself" });
			return;
		}

		const chatPartner = await Users.findByPk(req.body.chatPartnerId);

		// check if user already has a chat with the chat partner

		if (chatExists) {
			console.log("chat exists", chatExists);
			res.status(200).json(chatExists);
			return;
		}

		const userIds = [req.session.user_id, req.body.chatPartnerId];

		// find user names of chat partners
		const users = await Users.findAll({
			where: {
				id: userIds,
			},
		});

		const userNames = users.map((user) => user.username);

		const newChat = await Chat.create({
			chat_content: [],
			chat_host_username: userNames[0],
			chat_partner_username: userNames[1],
		});
		const chatId = [newChat.id, newChat.id];
		for (i = 0; i < 2; i++) {
			const chat_involvement = await Chat_involvement.create({
				user_id: userIds[i],
				chat_id: chatId[i],
			});
		}

		res.status(200).json(newChat);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

// Might work better when rooms are implimented. In a new room have a variable initialized to a value that won't correspond to a chat
// id and use that for the param id in the request. The request will create a new chat row and link the user passed into the body
// to that row. Request returns an object containing the new chat id which can be used to updated the initialized variable. Using that
// for a new post request for another user in the chat will skip creating a new chat row and add that user to the current chat.
router.post("/newChat/:id", async (req, res) => {
	// expect body like
	// {
	//   "userId": 1
	// }
	try {
		const chatExits = await Chat.findOne({ where: { id: req.params.id } });
		const userId = req.body.userId;
		let chatId = undefined;

		if (!chatExits) {
			const newChat = await Chat.create({
				chat_content: [],
			});
			chatId = newChat.id;
		} else {
			chatId = req.params.id;
		}

		const chat_involvement = await Chat_involvement.create({
			user_id: userId,
			chat_id: chatId,
		});

		res.status(200).json(chat_involvement);
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
