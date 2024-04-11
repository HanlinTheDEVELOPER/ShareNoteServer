import { StatusCodes } from "http-status-codes";
import isFollow from "../lib/isFollow.js";
import UserFollow from "../models/userFollow.js";
import { successResponse } from "../lib/response.js";

export const follow = async (req, res) => {
  const profileSlug = req.body.profileSlug;
  const userId = req.user;
  const boo = await isFollow(userId, profileSlug);
  console.log(boo);
  return res.status(204).json();
};

export const unfollow = async (req, res) => {
  try {
    const profileSlug = req.body.profileSlug;
    const userId = req.user;
    const followList = await UserFollow.findOne({ userId }).populate({
      path: "following",
      select: "slug",
    });
    const newFollowingList = followList?.following?.filter(
      (user) => user.slug !== profileSlug
    );
    const newFollowList = await UserFollow.updateOne(
      { userId },
      {
        following: newFollowingList,
      }
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK), "Unfollowed Successfully", {
        data: "oK",
      });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        successResponse(StatusCodes.INTERNAL_SERVER_ERROR),
        "Internal Server Error",
        { error }
      );
  }
};
