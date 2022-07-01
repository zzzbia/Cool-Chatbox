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
				window.location = "dashboard/chat/" + data.id;
			}
		})
		.catch((e) => {
			console.log(e);
		});
});
