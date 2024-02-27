import { errorResponse } from "./response.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { generateNewToken } from "../controllers/auth.js";

const isJWTValid = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        errorResponse(StatusCodes.UNAUTHORIZED, "NO Access Token Provided")
      );
    return;
  }
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedToken) => {
      if (err?.message === "jwt expired") {
        generateNewToken(req, res, next);
      } else if (err) {
        res.status(StatusCodes.FORBIDDEN).json(
          errorResponse(StatusCodes.FORBIDDEN, "Unauthorizedss", {
            err: err.message,
          })
        );
        return;
      } else {
        return decodedToken;
      }
    }
  );
  return decodedToken;
};

export default isJWTValid;
