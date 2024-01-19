import { errorResponse } from "./response.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const isJWTValid = (req, res) => {
  const token = req.get("Authentication");
  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorizedse"));
    return;
  }
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedToken) => {
      if (err?.message === "jwt expired") {
        res
          .status(StatusCodes.FORBIDDEN)
          .json(errorResponse(StatusCodes.FORBIDDEN, "Unauthorizedss"));
        return;
      } else if (err) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json(errorResponse(StatusCodes.FORBIDDEN, "Unauthorizedss"));
        return;
      } else {
        return decodedToken;
      }
    }
  );
  return decodedToken;
};

export default isJWTValid;
