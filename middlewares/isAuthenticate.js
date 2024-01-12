import isJWTValid from "../lib/verifyJWT.js";

export const isAuthenticate = (req, res, next) => {
  const decodedToken = isJWTValid(req, res);
  console.log("decodedToken", decodedToken);
  if (decodedToken) {
    req.user = decodedToken.id;
    next();
  }
};
