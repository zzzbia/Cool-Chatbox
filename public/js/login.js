const loginFormHandler = async (event) => {
	event.preventDefault();

	const username = document.getElementById("username-login").value;
	const password = document.getElementById("password-login").value;

	if (username && password) {
		try {
			const response = await fetch("/api/users/login", {
				credentials: "include",
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: { "Content-Type": "application/json" },
			});

			if (response.ok) {
				document.location.replace("/dashboard");
			} else {
				toastr.error("Invalid username or password");
			}
		} catch (e) {
			console.log(e);
		}
	} else {
		toastr.error("Please enter your username and password");
	}
};

document
	.querySelector("#login-form")
	.addEventListener("submit", loginFormHandler);
