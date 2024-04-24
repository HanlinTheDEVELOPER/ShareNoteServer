import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { errorResponse, successResponse } from "../lib/response.js";

export const login = async (req, res) => {
  try {
    const reqUser = req.query.user;
    const id = atob(reqUser);

    const user = await User.findById(id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    await User.findByIdAndUpdate(user._id, {
      refresh_tokens: [...user.refresh_tokens, refreshToken],
    });

    req.session.destroy();
    res.status(StatusCodes.CREATED).json(
      successResponse(StatusCodes.CREATED, "Log In Success", {
        id: user._id,
        tags: user.tags,
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

export const generateNewToken = async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "No Refresh Token"));
  }
  const refreshToken = cookie.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
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
              .status(StatusCodes.UNAUTHORIZED)
              .json(
                errorResponse(
                  StatusCodes.UNAUTHORIZED,
                  "Not Found Invalid Refresh Token"
                )
              );
          }
          const faultUser = await User.findById(decoded.id);
          if (!faultUser) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json(
                errorResponse(
                  StatusCodes.UNAUTHORIZED,
                  "Falt User Not Found Invalid Refresh Token"
                )
              );
          }
          faultUser.refresh_tokens = [];
          await User.findByIdAndUpdate(faultUser._id, {
            refresh_tokens: [],
          });
        }
      );
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          errorResponse(StatusCodes.UNAUTHORIZED, "Blah Invalid Refresh Token")
        );
    }
    const newRefreshTokens = user.refresh_tokens.filter(
      (token) => token !== refreshToken
    );
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    await User.findByIdAndUpdate(user._id, {
      ...user,
      refresh_tokens: [...newRefreshTokens, newRefreshToken],
    });
    req.user = user._id;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error ",
          error
        )
      );
  }
};

export const checkIsLogin = async (req, res) => {
  const id = req.user;
  const user = await User.findById(id).select("tags");
  if (user) {
    res.status(StatusCodes.OK).json(
      successResponse(StatusCodes.OK, "Status OK", {
        id: user?._id,
        tags: user?.tags,
      })
    );
  }
};

export const logout = async (req, res) => {
  const id = req.user;
  try {
    const user = await User.findById(id);
    const refreshToken = req.cookies?.jwt;

    if (user && refreshToken) {
      await User.findOneAndUpdate(
        { refresh_tokens: refreshToken },
        {
          refresh_tokens: user.refresh_tokens.filter(
            (token) => token !== refreshToken
          ),
        }
      );
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(StatusCodes.OK).json(
      successResponse(StatusCodes.OK, "Logout Success", {
        status: "OK",
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error ",
          error
        )
      );
  }
};

export const logoutOfAllDevices = async (req, res) => {
  const id = req.user;
  try {
    const user = await User.findById(id);

    await User.findByIdAndUpdate(user._id, {
      ...user,
      refresh_tokens: [],
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(StatusCodes.OK).json(
      successResponse(StatusCodes.OK, "Logout Success", {
        status: "OK",
      })
    );
  } catch (error) {
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
