import isJWTValid from "../lib/verifyJWT.js";

const isAuthenticate = (req, res, next) => {
  const decodedToken = isJWTValid(req, res);

  if (decodedToken) {
    req.user = decodedToken.id;
    next();
  }
};

export default isAuthenticate;
