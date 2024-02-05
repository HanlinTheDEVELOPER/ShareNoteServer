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
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      nullable: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
