import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleFollow = asyncHandler(async (req, res) => {
    const { userToFollow_id } = req.body;
    const user = req.user;

    // Find the user to follow
    const userToFollow = await User.findOne({ _id: userToFollow_id });

    if (!userToFollow) {
        throw new ApiError(400, "Invalid user to follow!!");
    }

    // Check if user is already following/unfollowing
    const isFollowed = userToFollow.follower?.includes(user?._id);
    const isFollowing = user.following?.includes(userToFollow_id);
    let state;
    // Update user's following and userToFollow's followers
    if (isFollowed && isFollowing) {
        // Unfollow
        const userIndex = user.following.indexOf(userToFollow_id);
        const userToFollowIndex = userToFollow.follower.indexOf(user._id);

        if (userIndex > -1) user.following.splice(userIndex, 1);
        if (userToFollowIndex > -1) userToFollow.follower.splice(userToFollowIndex, 1);
        
        console.log("User unfollowed");
        state = 'unfollowed';
    } else {
        // Follow
        user.following.push(userToFollow_id);
        userToFollow?.follower?.push(user._id);

        console.log("User followed");
        state = 'followed';
    }

    // Save both users
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await user.save({ session });
        await userToFollow.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(new ApiResponse(200, { user, userToFollow }, `User ${state} successfully!!`));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        throw new ApiError(500, "Failed to toggle follow");
    }
});

const getUserFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user.followers, "User followers fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    const user = await User.findById(subscriberId)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user.following, "User subscriptions fetched successfully"));
});

export {
    toggleFollow,
    getUserFollowers,
    getSubscribedChannels
};
