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
				chatListItem.addEventListener("click", function () {
					window.location = "/dashboard/chat/" + chat.id;
				});
				chatListItem.innerHTML = `
					<img src="/images/chat.png" class="rounded-full mr-2 h-10 w-10" alt="avatar" />
					<div class="flex-1">
						<h3 class="text-xl font-semibold">${chat.chat_host_username} / ${chat.chat_partner_username}</h3>
						<p class="text-sm"></p>
					</div>
					<div class="flex-1 text-right">
						 <p class="text-sm">Chat</p>
					</div>
				`;
				chatList.appendChild(chatListItem);
			});
		}
	});
