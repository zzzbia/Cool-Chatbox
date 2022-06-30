const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const sequelize = require("./config/connection");

//Initializing socket.io
const http = require("http");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const server = http.createServer(app);


const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:8100",
		methods: ["GET", "POST"],
		transports: ["websocket", "polling"],
		credentials: true,
	},
	allowEIO3: true,
});

const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

const sess = {
	secret: "Super secret secret",
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("chat message", (message) => {
		console.log(`server received message ${message}`);
		io.emit("chat message", message);
	});
});

app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize
	.sync({ force: false })
	.then(() => {
		server.listen(PORT, () => {
			console.log(`App listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
