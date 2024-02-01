import { errorResponse, successResponse } from "../lib/response.js";
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
