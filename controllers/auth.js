import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { errorResponse, successResponse } from "../lib/response.js";

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

export const updateProfile = (req, res) => {
  console.log(req.body);
  console.log(req.file);
  return res.status(200).json({ file: req.file });
};
