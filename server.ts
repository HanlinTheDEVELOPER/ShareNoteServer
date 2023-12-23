import express, { Request, Response } from "express";
import "./database";
import "dotenv/config";
import NoteRouter from "./routes/note";
import exp from "constants";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

const router = express.Router();
app.use("/api/v1", router);
router.use("/notes", NoteRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
