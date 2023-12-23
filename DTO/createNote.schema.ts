import mongoose from "mongoose";
import { object, string, mixed, ref } from "yup";

const createNoteSchema = object().shape({
  title: string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(10, "Title must be less than 10 characters"),
  content: string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  visibility: mixed()
    .oneOf(["public", "private"], "visibility must be either public or private")
    .required("visibility is required"),
  receiver: string().test(
    "is-objectId",
    "Receiver must be a valid ObjectId",
    (value) => {
      return value === undefined || mongoose.Types.ObjectId.isValid(value);
    }
  ),
});

export default createNoteSchema;
