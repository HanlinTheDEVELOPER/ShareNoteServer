import mongoose from "mongoose";

const savedNotes = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  savedNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

export const SavedNotes = mongoose.model("Saved Notes", savedNotes);
