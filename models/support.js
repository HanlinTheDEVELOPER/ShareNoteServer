import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  coins: {
    type: Number,
    required: true,
  },
  supporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
  },
});
