import { StatusCodes } from "http-status-codes";
import isFollow from "../lib/isFollow.js";
import UserFollow from "../models/userFollow.js";
import { successResponse } from "../lib/response.js";
import User from "../models/user.js";

export const follow = async (req, res) => {
  try {
    const profileId = req.body.profileId;
    const userId = req.user;
    let followList = await UserFollow.findOne({
      userId,
      // following: { $ne: profileId }, //fetch item not including profile id in following field arr
    }).select("following");

    if (!followList) {
      followList = await UserFollow.create({
        userId,
        following: [],
        follower: [],
      });
    }

    //array.push change original array
    followList?.following?.push(profileId);

    const newFollowList = await UserFollow.findOneAndUpdate(
      { userId },
      {
        following: followList?.following,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(profileId, {
      $inc: { supports: 1 },
    });

    let profileFollowerList = await UserFollow.findOne({
      userId: profileId,
    }).select("follower");

    if (!profileFollowerList) {
      profileFollowerList = await UserFollow.create({
        userId: profileId,
        following: [],
        follower: [],
      });
    }

    const followerSet = new Set(profileFollowerList.follower);
    const oldLength = followerSet.size;
    followerSet.add(userId);
    const newLength = followerSet.size;
    if (oldLength + 1 === newLength) {
      await UserFollow.findOneAndUpdate(
        { userId: profileId },
        {
          follower: Array.from(followerSet),
        }
      );
    }

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
    const profile = await User.findOne({ slug: profileSlug }).select("_id");
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
    await User.findOneAndUpdate(
      { slug: profileSlug },
      {
        $inc: { supports: -1 },
      }
    );

    let profileFollowerList = await UserFollow.findOne({
      userId: profile._id,
    })
      .select("follower")
      .populate({ path: "follower", select: "slug" });

    if (profileFollowerList) {
      const newProfileFollowerList = profileFollowerList?.follower?.filter(
        (user) => user._id !== userId
      );
      await UserFollow.findOneAndUpdate(
        { userId: profile._id },
        {
          follower: newProfileFollowerList,
        }
      );
    }

    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(StatusCodes.OK),
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
        { error }
      );
  }
};
