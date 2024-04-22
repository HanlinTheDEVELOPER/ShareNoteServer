import mongoose from "mongoose";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(10, "Title must be less than 10 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  tags: z.string().array(),
  user: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Provide a valid user id"
    ),
});
// .refine(
//   (schema) => (schema.visibility === "private" ? !!schema.receiver : true),
//   {
//     message: "Receiver is required when visibility is private",
//   }
// );

export default createNoteSchema;
