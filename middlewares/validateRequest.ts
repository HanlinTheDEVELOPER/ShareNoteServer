import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      res.status(400).send(error.errors);
    }
  };

export default validate;
