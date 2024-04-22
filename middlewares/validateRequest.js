import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../lib/response.js";
const validate = (schema) => async (req, res, next) => {
  try {
    const data = await schema.parse(req.body, { abortEarly: false });
    // console.log(data);
    next();
  } catch (error) {
    const original = error.issues;
    const errors = original.reduce((acc, error) => {
      acc[error.path[0] || error.code] = error.message;
      return acc;
    }, {});

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse(StatusCodes.BAD_REQUEST, "Validation error", errors));
  }
};

export default validate;
