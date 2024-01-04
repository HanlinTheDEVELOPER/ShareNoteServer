import isJWTValid from "../lib/verifyJWT.js";

export const isAuthenticate = (req, res, next) => {
  const decodedToken = isJWTValid();
  req.body.sender = decodedToken.id;
  next();
};
