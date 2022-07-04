const chatId = window.location.pathname.split("/")[3];
const socket = io({
	query: {
		chatId: chatId,
	},
});

function playNotification() {
	const audioEl = document.getElementById("notification");
	audioEl.play();
}

const addMessage = (message) => {
	const messagesholder = document.getElementById("messagesholder");
	const messageElement = document.createElement("div");
	messageElement.classList.add(
		"flex",
		"flex-row",
		"justify-between",
		"items-center",
		"p-2",
		"bg-indigo-100",
		"border-b-2",
		"border-indigo-200"
	);

	const messageText = document.createElement("div");
	messageText.classList.add(
		"w-full",
		"h-full",
		"text-left",
		"text-sm",
		"text-indigo-600"
	);
	messageText.innerText = `${message.username}: ${message.message}`;
	messageElement.appendChild(messageText);
	messagesholder.appendChild(messageElement);
	messagesholder.scrollTop = messagesholder.scrollHeight;
};

const syncPreviousMessages = async () => {
	try {
		const res = await fetch(`/api/chat/${chatId}`);
		const chat = await res.json();
		if (res.ok) {
			const chat_content = chat.chat_content;
			for (let i = 0; i < chat_content.length; i++) {
				addMessage(chat_content[i]);
			}
		} else {
			throw new Error("Error fetching chat");
		}
	} catch (e) {
		toastr.error("Error syncing previous messages");
	}
};

syncPreviousMessages();

const form = document.getElementById("sendbox");
const input = document.getElementById("message");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	console.log(`Sending message: ${input.value}`);
	if (input.value) {
		socket.emit("chat message", input.value);
		input.value = "";
	}
});

socket.on("chat message", (message) => {
	addMessage(message);
	playNotification();
});
