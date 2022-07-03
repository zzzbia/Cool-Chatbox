const router = require("express").Router();

// Routes
//Route for homepage
router.get("/", (req, res) => {
	res.render("homepage", {});
});

//Route for Chat after logged in

//Route for logging in
router.get("/login", (req, res) => {
	if (req.session.logged_in) {
		return res.redirect("/dashboard");
	}
	res.render("login", {});
});

router.get("/signup", (req, res) => {
	if (req.session.logged_in) {
		return res.redirect("/dashboard");
	}
	res.render("signup", {});
});

router.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});

module.exports = router;
