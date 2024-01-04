import { StatusCodes } from "http-status-codes";
import isJWTValid from "../lib/verifyJWT.js";
import { errorResponse } from "../lib/response.js";

export const isAuthorize = (req, res, next) => {
  const decodedToken = isJWTValid();
  if (req.body.sender != decodedToken.id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "unauthorized"));
  }
  next();
};
