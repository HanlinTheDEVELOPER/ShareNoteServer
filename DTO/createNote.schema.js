import mongoose from "mongoose";
import { object, string, mixed } from "yup";

const objectIdValidation = string().test(
  "is-objectId",
  "Provide a valid ObjectId",
  (value) => {
    return value === undefined || mongoose.Types.ObjectId.isValid(value);
  }
);

const createNoteSchema = object().shape({
  title: string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(10, "Title must be less than 10 characters"),
  content: string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  visibility: mixed().oneOf(
    ["public", "private"],
    "visibility must be either public or private"
  ),
  sender: objectIdValidation.required("Sender is required"),
  receiver: objectIdValidation,
});

export default createNoteSchema;

/* 
.when("visibility", {
    is: "private",
    then: (schema) =>
      schema
        .string()
        .required()
        .notOneOf(
          [""],
          "Receiver field is required when visibility is private"
        ),
    otherwise: (schema) => schema.string().notRequired(),
  }),
  */
