import express from "express";
import "./database.js";
import NoteRouter from "./routes/note.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const router = express.Router();
app.use("/api/v1", router);
router.use("/notes", NoteRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
