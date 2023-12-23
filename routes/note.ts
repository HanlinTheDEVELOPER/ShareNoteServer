import express, { Express } from "express";
import * as NoteController from "../controllers/note";
import validate from "../middlewares/validateRequest";
import createNoteSchema from "../DTO/createNote.schema";

const NoteRouter = express.Router();

NoteRouter.get("/", NoteController.index);
NoteRouter.post("/", validate(createNoteSchema), NoteController.create);

export default NoteRouter;
