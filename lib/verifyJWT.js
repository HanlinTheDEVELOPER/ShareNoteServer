import { errorResponse } from "./response.js";
import { StatusCodes } from "http-status-codes";

const isJWTValid = (req, res) => {
  const token = req.get("Authentication");
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorized"));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorized"));
  }
  return decodedToken;
};

export default isJWTValid;
