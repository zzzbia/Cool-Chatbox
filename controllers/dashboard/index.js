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

		res.render("chatlist", {
			helpers: {
				userId() {
					return req.session.user_id;
				},
				userName() {
					return userData.username;
				},
				userData() {
					return JSON.stringify(userData);
				},
			},
		});
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
