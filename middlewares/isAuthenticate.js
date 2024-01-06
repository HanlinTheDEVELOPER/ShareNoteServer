import isJWTValid from "../lib/verifyJWT.js";

export const isAuthenticate = (req, res, next) => {
  const decodedToken = isJWTValid(req, res, next);

  req.user = decodedToken.id;
  next();
};
