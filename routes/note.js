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
import { isAuthenticate } from "../middlewares/isAuthenticate.js";
import { isAuthorize } from "../middlewares/isAuthorize.js";

const NoteRouter = express.Router();

NoteRouter.get("/", getAllNotes);
NoteRouter.post("/", isAuthenticate, validate(createNoteSchema), createNote);
NoteRouter.get("/:id", showNoteById);
NoteRouter.put("/:id", isAuthorize, validate(createNoteSchema), updateNote);
NoteRouter.delete("/:id", isAuthorize, deleteNote);

export default NoteRouter;
