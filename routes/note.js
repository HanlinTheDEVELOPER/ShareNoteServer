import express from "express";
import {
  getAllNotes,
  createNote,
  getNoteBySlug,
  updateNote,
  deleteNote,
  addSupports,
  getNoteForUpdate,
  getSupporter,
  saveNote,
  unsaveNote,
  searchNotes,
  getNoteByUserId,
  getSavedNodeByUser,
} from "../controllers/note.js ";
import validate from "../middlewares/validateRequest.js";
import createNoteSchema from "../Schema/createNote.schema.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";

const NoteRouter = express.Router();

NoteRouter.get("/saved", isAuthenticate, getSavedNodeByUser);

NoteRouter.get("/", getAllNotes);
NoteRouter.post("/", isAuthenticate, validate(createNoteSchema), createNote);
NoteRouter.get("/:slug", getNoteBySlug);
NoteRouter.get("/update/:slug", isAuthenticate, getNoteForUpdate);
NoteRouter.post(
  "/update/:slug",
  isAuthenticate,
  validate(createNoteSchema),
  updateNote
);

NoteRouter.get("/search/:key", searchNotes);
NoteRouter.post("/delete/:slug", isAuthenticate, deleteNote);
NoteRouter.get("/uploaded/:userSlug", getNoteByUserId);

NoteRouter.post("/support/:slug", isAuthenticate, addSupports);
NoteRouter.get("/support/:slug", getSupporter);
NoteRouter.post("/save/:slug", isAuthenticate, saveNote);
NoteRouter.post("/unsave/:slug", isAuthenticate, unsaveNote);

export default NoteRouter;
