import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { errorResponse, successResponse } from "../lib/response.js";
import uploadImage from "../lib/uploadImage.js";

export const login = async (req, res) => {
  console.log("process.env.JWT_SECRET_KEY", process.env.JWT_EXPIRED_IN);
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "1d" }
    );

    user.refresh_tokens = [...user.refresh_tokens, refreshToken];
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

export const generateNewToken = async (req, res) => {
  console.log("generate,", req.cookies);
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    console.log("No Refresh adfasfasfToken");
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "No Refresh Token"));
  }
  const refreshToken = cookie.jwt;
  res.clearCookie("jwt", { httpOnly: true });
  try {
    const user = await User.findOne({ refresh_tokens: refreshToken });
    //detect reuse
    if (!user) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        async (err, decoded) => {
          if (err) {
            res
              .status(StatusCodes.FORBIDDEN)
              .json(
                errorResponse(StatusCodes.FORBIDDEN, "Invalid Refresh Token")
              );
          }
          const faultUser = await User.findById(decoded.id);
          if (!faultUser) {
            return res
              .status(StatusCodes.FORBIDDEN)
              .json(
                errorResponse(StatusCodes.FORBIDDEN, "Invalid Refresh Token")
              );
          }
          faultUser.refresh_tokens = [];
          await faultUser.save();
        }
      );
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(errorResponse(StatusCodes.FORBIDDEN, "Invalid Refresh Token"));
    }
    const newRefreshTokens = user.refresh_tokens.filter(
      (token) => token !== refreshToken
    );
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.refresh_tokens = [...newRefreshTokens, newRefreshToken];
    await user.save();

    res.status(StatusCodes.CREATED).json(
      successResponse(StatusCodes.CREATED, "Refresh Token Success", {
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

export const checkIsLogin = async (req, res) => {
  res.status(StatusCodes.OK).json(
    successResponse(StatusCodes.OK, "Status OK", {
      status: "OK",
    })
  );
};
