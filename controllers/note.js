import Note from "../models/note.js";

export const index = async (req, res) => {
  const notes = await Note.find();
  if (!notes) {
    return res.status(500).json({ message: "internal server error" });
  }
  res.status(200).json(notes);
};

export const create = async (req, res) => {
  const { title, content, visibility, receiver, sender } = req.body;

  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const show = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  res.status(200).json(note);
};
