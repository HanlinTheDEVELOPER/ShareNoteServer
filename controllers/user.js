import { errorResponse, successResponse } from "../lib/response.js";
import Note from "../models/note.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";

export const getMe = async (req, res) => {
  const user = await User.findById(req.user).select("-refresh_tokens");
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse(StatusCodes.NOT_FOUND, "User not found"));
  }
  return res
    .status(StatusCodes.OK)
    .json(successResponse(StatusCodes.OK, "Fetch Message Success", user));
};

export const getNotesByMe = async (req, res) => {
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 24;
  let totalNotes;

  const myNotes = await Note.find({ sender: req.user })
    .select("title slug ")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit);
  if (!myNotes) {
    return res.status(500).json({ message: "internal server error" });
  }
  totalNotes = myNotes.length;
  return res.status(StatusCodes.ACCEPTED).json(
    successResponse(StatusCodes.ACCEPTED, "Fetch my notes success", {
      notes: myNotes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage,
    })
  );
};

export const getNotesToMe = async (req, res) => {
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 24;
  let totalNotes;

  const myNotes = await Note.find({ receiver: req.user })
    .select("title slug ")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit);
  if (!myNotes) {
    return res.status(500).json({ message: "internal server error" });
  }
  totalNotes = myNotes.length;
  return res.status(StatusCodes.ACCEPTED).json(
    successResponse(StatusCodes.ACCEPTED, "Fetch my notes success", {
      notes: myNotes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage,
    })
  );
};
