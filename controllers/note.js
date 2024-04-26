import Note from "../models/note.js";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../lib/response.js";
import isFollow from "../lib/isFollow.js";

export const getAllNotes = async (req, res) => {
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 24;
  const tag = req.query.tag;
  let totalNotes;
  Note.find()
    .countDocuments()
    .then((count) => (totalNotes = count))
    .catch((err) => {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          errorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal Server Error",
            err
          )
        );
    });

  const filter = tag === "Recommends" ? {} : { tags: tag };

  const notes = await Note.find(filter)
    .select("title slug createdAt supports")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit)
    .populate("user", ["name", "email", "avatar", "slug"]);
  if (!notes) {
    return res.status(500).json({ message: "internal server error" });
  }
  res.status(StatusCodes.OK).json(
    successResponse(StatusCodes.OK, "Fetch Message Success", {
      notes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage,
    })
  );
};

export const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      slug: req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^A-Z0-9]/gi, "_")
        .substr(0, 50),
    });
    return res
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

export const getNoteBySlug = async (req, res) => {
  const slug = req.params.slug;
  const note = await Note.findOne({ slug }).populate("user", [
    "name",
    "slug",
    "email",
    "avatar",
  ]);
  if (!note) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse(StatusCodes.NOT_FOUND, "Note not found"));
  }
  const userId = req.get("userId");
  const isFollowing = await isFollow(userId, note.user.slug);

  return res.status(StatusCodes.OK).json(
    successResponse(StatusCodes.OK, "Fetch Message Success", {
      ...note._doc,
      isFollowing,
    })
  );
};

export const getNoteForUpdate = async (req, res) => {
  try {
    const { slug } = req.params;

    const note = await Note.findOne({ slug }).select("title content tags");
    return res
      .status(StatusCodes.ACCEPTED)
      .json(successResponse(StatusCodes.ACCEPTED, " Fetched Success", note));
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Fetched Failed",
          error
        )
      );
  }
};

export const updateNote = async (req, res) => {
  const { slug } = req.params;
  try {
    const updateNote = await Note.findOneAndUpdate(
      { slug },
      {
        ...req.body,
        slug: req.body.title
          .toLowerCase()
          .trim()
          .replace(/[^A-Z0-9]/gi, "_")
          .substr(0, 50),
      },
      {
        new: true,
        fields: { slug: 1 },
      }
    );
    console.log(updateNote);
    if (!updateNote) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse(StatusCodes.NOT_FOUND, "Note not found"));
    }
    return res
      .status(StatusCodes.ACCEPTED)
      .json(successResponse(StatusCodes.ACCEPTED, "Note Updated", updateNote));
  } catch (error) {
    console.log(error);
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

export const deleteNote = async (req, res) => {
  const { slug } = req.params;
  try {
    await Note.findOneAndDelete({ slug });

    return res
      .status(StatusCodes.OK)
      .json(StatusCodes.OK, "Note Deleted", { msg: "ok" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        successResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};

export const addSupports = async (req, res) => {
  const { slug } = req.params;
  try {
    const note = await Note.findOne({ slug }).select("supports");
    await Note.findOneAndUpdate({ slug }, { supports: note.supports + 1 });
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "Added Supports", {}));
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed", {}));
  }
};
