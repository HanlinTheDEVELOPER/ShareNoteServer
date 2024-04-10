import UserFollow from "../models/userFollow.js";

const isFollow = async (req, profileSlug) => {
  const userId = req.user;
  const followList = await UserFollow.findOne({ userId: userId }).populate({
    path: "following",
    select: "slug ",
  });

  const isFollowing = !!followList?.following?.find(
    (user) => user.slug === profileSlug
  );
  return isFollowing;
};
export default isFollow;
