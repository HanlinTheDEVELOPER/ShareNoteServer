import Note from "../models/note.js";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../lib/response.js";

export const index = async (req, res) => {
  const notes = await Note.find();
  if (!notes) {
    return res.status(500).json({ message: "internal server error" });
  }
  res
    .status(StatusCodes.ACCEPTED)
    .json(
      successResponse(StatusCodes.ACCEPTED, "Fetch Message Success", notes)
    );
};

export const create = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json(successResponse(StatusCodes.CREATED, "Create Note Success", note));
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};

export const show = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse(StatusCodes.NOT_FOUND, "Note not found"));
  }
  res
    .status(StatusCodes.ACCEPTED)
    .json(successResponse(StatusCodes.ACCEPTED, "Fetch Message Success", note));
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);

    res
      .status(StatusCodes.NO_CONTENT)
      .json(StatusCodes.NO_CONTENT, "Note Deleted", []);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        successResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};
