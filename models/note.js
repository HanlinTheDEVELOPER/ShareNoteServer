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
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
