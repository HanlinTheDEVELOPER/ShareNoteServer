import UserFollow from "../models/userFollow.js";

const isFollow = async (userId, profileSlug) => {
  const followList = await UserFollow.findOne({ userId }).populate({
    path: "following",
    select: "slug ",
  });

  const isFollowing = !!followList?.following?.find(
    (user) => user.slug === profileSlug
  );

  return isFollowing;
};
export default isFollow;
