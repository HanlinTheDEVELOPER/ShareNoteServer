import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { errorResponse, successResponse } from "../lib/response.js";
import uploadImage from "../lib/uploadImage.js";
export const login = async (req, res) => {
  try {
    const { displayName, email, picture } = req.user;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        avatar: picture,
      });
      if (!user) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            errorResponse(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "Internal Server Error"
            )
          );
      }
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    req.session.destroy();
    res.status(StatusCodes.CREATED).json(
      successResponse(StatusCodes.CREATED, "Log In Success", {
        token,
        id: user._id,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error "
        )
      );
  }
};

export const failure = (req, res) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error")
    );
};

export const updateProfile = async (req, res) => {
  const oldUser = await User.findById(req.user);
  let avatar_url = oldUser.avatar;
  if (req.file) {
    avatar_url = await uploadImage(req, res);
  }
  try {
    oldUser.name = req.body.name;
    oldUser.avatar = avatar_url;
    oldUser.plan = req.body.plan;
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
