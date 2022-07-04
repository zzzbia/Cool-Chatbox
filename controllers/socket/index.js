const { Chat, Users, Chat_involvement } = require("../../models");

let users = [];

//[ {
// 	userName: 'bob',
// 	userId: 1,
// 	socketId: 12
// } ]

const socketController = (io) => {
	io.use(async (socket, next) => {
		const session = socket.request.session;
		if (session && session.logged_in) {
			next();
		} else {
			socket.disconnect();
			next(new Error("unauthorized"));
		}
	});

	io.on("connection", (socket) => {
		socket.on("online", async () => {
			try {
				const session = socket.request.session;

				if (!users.some((user) => user.userId === session.user_id)) {
					const userData = await Users.findByPk(session.user_id);
					users.push({
						userName: userData.username,
						userId: session.user_id,
						socketId: socket.id,
					});
					console.log("users", users);
					io.emit("users", users);
				}
				socket.on("disconnect", () => {
					users = users.splice(
						users.findIndex((user) => user.socketId === socket.id),
						1
					);
					io.emit("users", users);
				});
			} catch (e) {
				console.log(e);
			}
			console.log("a user connected");
		});

		const chatId = socket.handshake.query.chatId;

		if (!chatId) {
			return;
		}

		socket.join(chatId);

		socket.on("chat message", async (message) => {
			try {
				const senderId = socket.request.session.user_id;
				const userData = await Users.findByPk(senderId);

				io.to(chatId).emit("chat message", {
					message: message,
					username: userData.username,
				});

				// update chat_content JSON array with new message
				// chatId is the primary key of the chat table

				const chat = await Chat.findByPk(chatId);

				const chat_content = chat.chat_content;

				if (message && userData.username) {
					chat.update({
						chat_content: chat_content.concat({
							username: userData.username,
							message: message,
						}),
					});
				}
			} catch (e) {
				console.log(e);
				throw new Error(e);
			}
		});
	});
};

module.exports = socketController;
