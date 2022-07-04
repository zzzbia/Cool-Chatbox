const router = require("express").Router();
const { Users, Chat } = require("../../models");

router.get("/", async (req, res) => {
	if (!req.session.logged_in) {
		return res.redirect("/login");
	}
	try {
		const userData = await Users.findByPk(req.session.user_id, {
			include: Chat,
		});
		const user = userData.get({ plain: true });

		let chat = [];
		let allChats = [];

		for(let h=0;h<user.chats.length;h++){
		for(let i=0;i<user.chats[h].chat_content.length;i++){
			chat.push({
				username:user.chats[h].chat_content[i].username,
				message:user.chats[h].chat_content[i].message
			})}
			allChats.push({id:h+1, chat_log:chat})
			chat=[]
		}

		res.render("chatlist", {logged_in: true, userId: req.session.user_id, userName: userData.username, userData: allChats});
	} catch (err) {
		res.status(400).json(err);
	}
});

router.get("/chat/:id", async (req, res) => {
	if (!req.session.logged_in) {
		return res.redirect("/login");
	}

	try {
		const chatData = await Chat.findByPk(req.params.id, { include: Users });

		const userData = await Users.findByPk(req.session.user_id);

		if (!chatData) {
			res
				.status(404)
				.json({ message: `No chat with ID: ${req.params.id} found` });
			return;
		}

		if (
			chatData.users.filter((user) => user.id === req.session.user_id)
				.length === 0
		) {
			res
				.status(403)
				.json({ message: "You are not allowed to access this chat" });
			return;
		}

		res.render("chat", {
			logged_in: true,
			helpers: {
				userId() {
					return req.session.user_id;
				},
				userName() {
					return userData.username;
				},
				chatData() {
					return JSON.stringify(chatData);
				},
			},
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
