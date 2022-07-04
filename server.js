const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const socketController = require("./controllers/socket");

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

const sess = session({
	secret: "Super secret secret",
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
});

app.use(sess);

const wrap = (middleware) => (socket, next) =>
	middleware(socket.request, {}, next);

io.use(wrap(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);
socketController(io);

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
