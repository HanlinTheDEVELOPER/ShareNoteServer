import { errorResponse } from "./response.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const isJWTValid = (req, res, next) => {
  const token = req.get("Authentication");

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorizedse"));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorizedss"));
  }
  return decodedToken;
};

export default isJWTValid;
