import { Request, Response } from "express";
import Note from "../models/note";

export const index = async (req: Request, res: Response) => {
  const notes = await Note.find();
  if (!notes) {
    return res.status(500).json({ message: "internal server error" });
  }
  res.status(200).json(notes);
};

export const create = async (req: Request, res: Response) => {
  const { title, content, visibility, receiver } = req.body;

  try {
    const note = await Note.create({ title, content, visibility, receiver });
    res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
