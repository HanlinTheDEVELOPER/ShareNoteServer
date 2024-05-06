import Note from "../models/note.js";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../lib/response.js";
import isFollow from "../lib/isFollow.js";
import UserFollow from "../models/userFollow.js";
import { SavedNotes } from "../models/savedNotes.js";
import isNoteSaved from "../lib/isNoteSaved.js";
import Support from "../models/support.js";
import { ObjectId } from "mongodb";

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
  let filter;
  if (tag === "Following") {
    const userId = req.get("userId");
    const followingList = await UserFollow.findOne({ userId });
    const following = followingList?.following ?? [];

    filter = { user: { $in: following } };
  } else {
    filter = tag === "Recommends" ? {} : { tags: tag };
  }

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

export const searchNotes = async (req, res) => {
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 24;
  const key = req.params.key;

  let totalNotes;
  Note.find({ slug: { $regex: ".*" + key + ".*" } })
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

  const notes = await Note.find({ slug: { $regex: ".*" + key + ".*" } })
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
  const isSaved = await isNoteSaved(userId, note?.slug);

  return res.status(StatusCodes.OK).json(
    successResponse(StatusCodes.OK, "Fetch Message Success", {
      ...note._doc,
      isFollowing,
      isSaved,
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
  try {
    const { slug } = req.params;
    const userId = req.user;
    const note = await Note.findOne({ slug }).select("_id");
    let noteSupporters = await Support.findOne({ noteId: note._id });

    if (!noteSupporters) {
      noteSupporters = await Support.create({
        noteId: note._id,
        supporters: [],
      });
    }

    const supporterSet = new Set(noteSupporters.supporters ?? []);
    const oldSupporterCount = supporterSet.size;

    supporterSet.add(userId);

    const newSupporterCount = supporterSet.size;

    if (oldSupporterCount !== newSupporterCount) {
      await Support.findOneAndUpdate(
        { noteId: note._id },
        { $push: { supporters: userId } }
      );
    }

    await Note.findOneAndUpdate({ slug }, { $inc: { supports: 1 } });
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

export const getSupporter = async (req, res) => {
  try {
    const { slug } = req.params;
    const note = await Note.findOne({ slug }).select("_id supports");
    const supporters = await Support.findOne({ noteId: note._id }).populate({
      path: "supporters",
      select: "name avatar slug",
    });
    return res.status(StatusCodes.OK).json(
      successResponse(StatusCodes.OK, "Success", {
        supporters: supporters?._doc.supporters,
        supports: note.supports,
      })
    );
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Get Supporter Failed",
          {}
        )
      );
  }
};

export const saveNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user;
    const note = await Note.findOne({ slug }).select("_id");
    let saved = await SavedNotes.findOne({ userId });

    if (!saved) {
      saved = await SavedNotes.create({ userId, savedNotes: [] });
    }

    await SavedNotes.findOneAndUpdate(
      { userId },
      { $push: { savedNotes: note._id } }
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "Saved", {}));
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed"));
  }
};

export const unsaveNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user;
    const notes = await SavedNotes.findOne({ userId }).populate({
      path: "savedNotes",
      select: "slug",
    });
    await SavedNotes.findOneAndUpdate(
      { userId },
      {
        savedNotes: notes?.savedNotes.filter((note) => note.slug !== slug),
      }
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "Saved", {}));
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed"));
  }
};
