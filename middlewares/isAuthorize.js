import { StatusCodes } from "http-status-codes";
import isJWTValid from "../lib/verifyJWT.js";
import { errorResponse } from "../lib/response.js";

const isAuthorize = (req, res, next) => {
  const decodedToken = isJWTValid(req, res);
  if (decodedToken?.id) {
    req.user = decodedToken.id;
    next();
  }
};

export default isAuthorize;
