import mongoose from "mongoose";

const userFollowSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export default mongoose.model("UserFollow", userFollowSchema);
