import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
  },
  supporters: [
    {
      type: String,
      ref: "User",
    },
  ],
});

export default mongoose.model("Support", supportSchema);
