import { StatusCodes } from "http-status-codes";
import isFollow from "../lib/isFollow.js";
import UserFollow from "../models/userFollow.js";
import { successResponse } from "../lib/response.js";

export const follow = async (req, res) => {
  try {
    const profileId = req.body.profileId;
    const userId = req.user;
    const followList = await UserFollow.findOne({
      userId,
      following: { $ne: profileId }, //fetch item not including profile id in following field arr
    }).select("following");

    //array.push change original array
    followList?.following?.push(profileId);

    const newFollowList = await UserFollow.findOneAndUpdate(
      { userId },
      {
        following: followList?.following,
      },
      { new: true }
    );
    return res
      .status(StatusCodes.ACCEPTED)
      .json(
        successResponse(StatusCodes.ACCEPTED),
        "Unfollowed Successfully",
        newFollowList
      );
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        successResponse(StatusCodes.INTERNAL_SERVER_ERROR),
        "Internal Server Error",
        error
      );
  }
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
    const newFollowList = await UserFollow.findOneAndUpdate(
      { userId },
      {
        following: newFollowingList,
      },
      { new: true }
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(StatusCodes.OK),
        "Unfollowed Successfully",
        newFollowList
      );
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
