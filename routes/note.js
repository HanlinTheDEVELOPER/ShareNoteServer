import express from "express";
import * as NoteController from "../controllers/note.js ";
import validate from "../middlewares/validateRequest.js";
import createNoteSchema from "../DTO/createNote.schema.js";

const NoteRouter = express.Router();

NoteRouter.get("/", NoteController.index);
NoteRouter.post("/", validate(createNoteSchema), NoteController.create);

export default NoteRouter;