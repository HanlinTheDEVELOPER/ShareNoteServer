import express from "express";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import passport from "passport";
import { initializeApp } from "firebase/app";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import corsConfig from "./middlewares/corsConfig.js";
import "./database.js";
import "./strategies/google0auth.js";
import { firebaseConfig } from "./firebase.config.js";
import NoteRouter from "./routes/note.js";
import AuthRouter from "./routes/auth.js";
import UserRouter from "./routes/user.js";
import UserFollowRouter from "./routes/userFollow.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsConfig));
initializeApp(firebaseConfig);
app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// app.use(bodyParser());

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const router = express.Router();
app.use("/api/v1", router);
router.use("/notes", NoteRouter);
router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/follow", UserFollowRouter);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
