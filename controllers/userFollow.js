import isFollow from "../lib/isFollow.js";

export const follow = async (req, res) => {
  const profileId = req.body.profileSlug;
  const boo = await isFollow(req, profileId);
  console.log(boo);
  return res.status(204).json();
};
