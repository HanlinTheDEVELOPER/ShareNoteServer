import express from "express";
import {
  getAllNotes,
  createNote,
  getNoteBySlug,
  updateNote,
  deleteNote,
} from "../controllers/note.js ";
import validate from "../middlewares/validateRequest.js";
import createNoteSchema from "../Schema/createNote.schema.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";
import { addSupports } from "../controllers/note.js";
const NoteRouter = express.Router();

NoteRouter.get("/", getAllNotes);
NoteRouter.post("/", isAuthenticate, validate(createNoteSchema), createNote);
NoteRouter.get("/:slug", getNoteBySlug);
NoteRouter.put("/:id", isAuthenticate, validate(createNoteSchema), updateNote);
NoteRouter.delete("/:id", isAuthenticate, deleteNote);

NoteRouter.post("/:slug", isAuthenticate, addSupports);

export default NoteRouter;
