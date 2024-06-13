import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Follower } from "../models/follower.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleFollow = asyncHandler(async (req, res) => {
    const {userToFollow_id}= req.body;
    const user= req.user;
    const userToFollow= await User.findOne({_id:userToFollow_id})

    if(!userToFollow){
        throw new ApiError(400, "Invalid user to follow!!")
    }

    const isfollowIndex= userToFollow.follower.findIndex(id => id.toString() ===user._id.toString());

    let state;
    if (isfollowIndex !== -1) {
      // User ID exists, so remove it from the array
      userToFollow.follower.splice(isfollowIndex, 1);
      const isfollowingIndex= user.following.findIndex(id=> id.toString() ===userToFollow_id.toString());

      user.following.splice(isfollowingIndex,1);
      console.log("user unfollowed")
      state= 'unfollwed'
    } else {
      // User ID does not exist, so add it to the array (if you want to handle toggling)
      user.following.push(userToFollow_id.toString());
      userToFollow.follower.push(user._id.toString());
      console.log("user follwed")
      state='followed'
    }

    await user.save();
    await userToFollow.save();

    return res.status(201).json(new ApiResponse(200,{ user, userToFollow}, `user ${state} successfully!!`))
})

// controller to return subscriber list of a channel
const getUserFollowers = asyncHandler(async (req, res) => {
    const {userId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleFollow,
    getUserFollowers,
    getSubscribedChannels
}