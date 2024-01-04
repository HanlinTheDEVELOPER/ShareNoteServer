import { StatusCodes } from "http-status-codes";

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(StatusCodes.UNAUTHORIZED, "Unauthorized"));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
};
