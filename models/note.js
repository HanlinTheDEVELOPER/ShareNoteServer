import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      min: 3,
      max: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    supports: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
