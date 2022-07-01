const router = require("express").Router();

// Routes
//Route for homepage
router.get("/", (req, res) => {
	res.render("homepage", {});
});

//Route for Chat after logged in

//Route for logging in
router.get("/login", (req, res) => {
	res.render("login", {});
});

router.get("/signup", (req, res) => {
	res.render("signup", {});
});

router.get("/chatlist", (req, res) => {
	res.render("chatlist", {});
});

module.exports = router;
