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
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
