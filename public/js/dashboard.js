const socket = io();

socket.emit("online");

setInterval(() => {
	socket.emit("online");
}, 10000);

socket.on("users", (users) => {
	console.log(users);
	const usersList = document.getElementById("online-users");
	usersList.innerHTML = "";
	for (let i = 0; i < users.length; i++) {
		// append user to user list
		const user = document.createElement("li");
		user.classList.add(
			"flex",
			"flex-row",
			"justify-between",
			"items-center",
			"p-2",
			"bg-indigo-100",
			"border-b-2",
			"border-indigo-200",
			"cursor-pointer"
		);

		const userId = users[i].userId;

		user.addEventListener("click", () => {
			fetch("/api/chat/newChat", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chatPartnerId: userId,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					if (data.id) {
						toastr.success("Chat started!");

						setTimeout(() => {
							window.location = "/dashboard/chat/" + data.id;
						}, 1000);
						return;
					}
					if (data.message) {
						toastr.error(`${data.message}`);
					}
				})
				.catch((e) => {
					console.log("error", e);
				});
		});
		user.innerHTML = `<span class="text-sm text-indigo-600">${users[i].userName}</span>`;
		usersList.appendChild(user);
	}
});

const newChatForm = document.getElementById("new-chat");

newChatForm.addEventListener("submit", function (e) {
	e.preventDefault();
	const chatPartnerId = document.getElementById("chat-user").value;

	fetch("/api/chat/newChat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chatPartnerId: chatPartnerId,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data.id) {
				window.location = "/dashboard/chat/" + data.id;
			}
		})
		.catch((e) => {
			console.log(e);
		});
});

const chatHistorySelector = document.getElementById("chat_history_select");

chatHistorySelector.addEventListener("click", function (e) {
	e.preventDefault();
	const chatHistory = e.target.id.split("t");
	const chatHistoryElement = document.getElementById(chatHistory[1]);
	if (chatHistoryElement.style.display === "none") {
		chatHistoryElement.style.display = "block";
	} else {
		chatHistoryElement.style.display = "none";
	}
});

//chat-list

fetch("/api/users/myChats")
	.then((res) => res.json())
	.then((data) => {
		if (data.length) {
			console.log(data);
			data.forEach((chat) => {
				const chatList = document.getElementById("chat-list");
				const chatListItem = document.createElement("li");
				chatListItem.classList.add(
					"flex",
					"items-center",
					"py-2",
					"cursor-pointer",
					"bg-gray-200",
					"border-b-2",
					"px-4",
					"border-gray-300"
				);
				// make chat list item clickable and link to chat

				const chatDescription = document.createElement("div");
				chatDescription.classList.add("flex-1", "cursor-pointer");

				chatDescription.innerHTML = `
				<h3 class="text-xl font-semibold">${chat.chat_host_username} / ${chat.chat_partner_username}</h3>
				<p class="text-sm"></p>
				`;

				chatDescription.addEventListener("click", function () {
					window.location = "/dashboard/chat/" + chat.id;
				});

				const chatImage = document.createElement("img");
				chatImage.classList.add("rounded-full", "h-10", "w-10", "mr-2");
				chatImage.src = `/images/chat.png`;

				const deleteBtn = document.createElement("button");
				deleteBtn.classList.add(
					"bg-red-500",
					"text-white",
					"px-2",
					"py-1",
					"flex-1",
					"flex-grow-0",
					"p-10",
					"text-right",
					"rounded-full",
					"hover:bg-red-600",
					"hover:text-white",
					"hover:shadow-lg",
					"hover:shadow-outline",
					"hover:cursor-pointer",
					"cursor-pointer",
					"mr-2"
				);
				deleteBtn.innerHTML = "Delete";

				deleteBtn.addEventListener("click", function () {
					chatListItem.remove();
					fetch(`/api/chat/${chat.id}`, {
						method: "DELETE",
						headers: {
							Credentials: "include",
						},
					}).then((res) => {
						if (res.ok) {
							toastr.success("Chat deleted!");
						} else {
							toastr.error("Error deleting chat! Reload and try again");
						}
					});
				});

				chatListItem.appendChild(chatImage);
				chatListItem.appendChild(chatDescription);
				chatListItem.appendChild(deleteBtn);
				chatList.appendChild(chatListItem);
			});
		}
	});
