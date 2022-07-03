const router = require("express").Router();
const { Users, Chat } = require("../../models");
// get all users
router.get("/", async (req, res) => {
	try {
		const usersData = await Users.findAll();
		console.log(usersData);
		res.status(200).json(usersData);
	} catch (err) {
		res.status(400).json(err);
	}
});

router.get("/myChats", async (req, res) => {
	try {
		console.log("user", req.session.user_id);
		const userData = await Users.findByPk(req.session.user_id, {
			include: Chat,
		});
		console.log("my chats", userData);
		res.status(200).json(userData.chats);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

// For getting a user's chat history
router.get("/:id", async (req, res) => {
	try {
		const userData = await Users.findByPk(req.params.id, { include: Chat });

		res.status(200).json(userData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// For user sign up
router.post("/", async (req, res) => {
	try {
		const userData = await Users.create(req.body);

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;

			res.status(200).json(userData);
		});
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

// for login attempts
router.post("/login", async (req, res) => {
	try {
		const userData = await Users.findOne({
			where: { username: req.body.username },
		});

		if (!userData) {
			res.status(400).json({ message: "Incorrect username or password" });
			return;
		}

		const validPassword = userData.checkPassword(req.body.password);
		if (!validPassword) {
			res.status(400).json({ message: "Incorrect username or password" });
			return;
		}

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;

			res.json({ user: userData, message: `Welcome ${userData.username}` });
		});
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

//for logging out
router.post("/logout", (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

module.exports = router;
