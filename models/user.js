import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    gems: {
      type: Number,
      default: 0,
    },
    refresh_tokens: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
