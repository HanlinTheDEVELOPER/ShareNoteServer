import express from "express";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import "./database.js";
import NoteRouter from "./routes/note.js";
import AuthRouter from "./routes/auth.js";
import passport from "passport";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
