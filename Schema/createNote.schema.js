import mongoose from "mongoose";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().array(),
  user: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Provide a valid user id"
    )
    .optional(),
});
// .refine(
//   (schema) => (schema.visibility === "private" ? !!schema.receiver : true),
//   {
//     message: "Receiver is required when visibility is private",
//   }
// );

export default createNoteSchema;
