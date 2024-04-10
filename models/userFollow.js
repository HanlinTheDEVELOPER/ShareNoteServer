import mongoose from "mongoose";

const userFollowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  follower: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

export default mongoose.model("UserFollow", userFollowSchema);
