import { errorResponse, successResponse } from "../lib/response.js";
import Note from "../models/note.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import uploadImage from "../lib/uploadImage.js";
import { deleteImage } from "../lib/deleteImage.js";
import isFollow from "../lib/isFollow.js";

export const getProfile = async (req, res) => {
  const slug = req.query.slug;
  const userId = req.get("userId");
  const isFollowing = await isFollow(userId, slug);
  const profile = await User.findOne({ slug }).select(
    "name slug email avatar tags"
  );

  if (!profile) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse(StatusCodes.NOT_FOUND, "User not Found"));
  }

  return res.status(StatusCodes.OK).json(
    successResponse(StatusCodes.OK, "Fetch Profile Success", {
      ...profile._doc,
      isFollowing,
    })
  );
};

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

export const updateProfile = async (req, res) => {
  const oldUser = await User.findById(req.user);
  let avatar_url = oldUser.avatar;
  if (req.file) {
    avatar_url = await uploadImage(req, res);
    deleteImage(oldUser.avatar);
  }

  try {
    oldUser.name = req.body.name ?? oldUser.name;
    oldUser.avatar = avatar_url ?? oldUser.avatar;
    oldUser.plan = req.body.plan ?? oldUser.plan;
    await oldUser.save();
    res
      .status(StatusCodes.ACCEPTED)
      .json(
        successResponse(StatusCodes.ACCEPTED, "Update Profile Success", oldUser)
      );
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

export const updateTagsAndUserName = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user, {
      name: req.body.name,
      tags: req.body.tags,
    });
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(StatusCodes.ACCEPTED, "Set Up Account Complete", user)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        successResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Set Up Account Failed",
          error
        )
      );
  }
};

export const changeUsername = async (req, res) => {
  const id = req.user;
  try {
    const name = req.body.name;
    const updateUserWithNewName = await User.findByIdAndUpdate(
      id,
      {
        name,
      },
      { new: true }
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(
          StatusCodes.OK,
          "Update Username Success.",
          updateUserWithNewName
        )
      );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR), "failed", error);
  }
};

export const updateTags = async (req, res) => {
  const id = req?.user;
  try {
    const tags = req.body.tags;

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        tags,
      },
      { new: true }
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "Update Tags Success", updateUser));
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Update Tags Failed",
          error
        )
      );
  }
};
