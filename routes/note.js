import express from "express";
import {
  getAllNotes,
  createNote,
  showNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.js ";
import validate from "../middlewares/validateRequest.js";
import createNoteSchema from "../Schema/createNote.schema.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";
const NoteRouter = express.Router();

NoteRouter.get("/", getAllNotes);
NoteRouter.post("/", isAuthenticate, validate(createNoteSchema), createNote);
NoteRouter.get("/:id", showNoteById);
NoteRouter.put("/:id", isAuthenticate, validate(createNoteSchema), updateNote);
NoteRouter.delete("/:id", isAuthenticate, deleteNote);

export default NoteRouter;
