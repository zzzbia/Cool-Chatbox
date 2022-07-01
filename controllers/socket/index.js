const { Chat, Users, Chat_involvement } = require("../../models");

const socketController = (io) => {
	io.use((socket, next) => {
		const session = socket.request.session;
		if (session && session.logged_in) {
			next();
		} else {
			next(new Error("unauthorized"));
		}
	});

	io.on("connection", (socket) => {
		console.log("a user connected");
		socket.on("chat message", async (message) => {
			try {
				const senderId = socket.request.session.user_id;
				const userData = await Users.findByPk(senderId);

				io.emit("chat message", {
					message: message,
					username: userData.username,
				});
			} catch (e) {
				throw new Error("Error while fetching user data");
			}
		});
	});
};

module.exports = socketController;
