import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { comment_id } = req.params;
  const user = req.user;

  if(!comment_id) throw new ApiError(400, "Can't get comment id!!")

  const isCommentExist= await Comment.findOne({_id: comment_id})

  if(!isCommentExist){
    throw new ApiError(400, "No Comment Found Related to given id!!")
  }

  const userIdString = user._id.toString();

    // Check if the user ID exists in the commentLikes array
    const userIndex = isCommentExist.commentLikes.findIndex(id => id.toString() === userIdString);
    let state;
    if (userIndex !== -1) {
      // User ID exists, so remove it from the array
      isCommentExist.commentLikes.splice(userIndex, 1);
      console.log("user unliked the comment")
      state= 'unliked'
    } else {
      // User ID does not exist, so add it to the array (if you want to handle toggling)
      isCommentExist.commentLikes.push(userIdString);
      console.log("user liked the comment")
      state='liked'
    }

  await isCommentExist.save();


  return res.status(201).json(new ApiResponse(200, isCommentExist, `Commet ${state} Successfully!!`))
});

const toggleReplyLike = asyncHandler(async (req, res) => {
  const { comment_id, reply_id } = req.body;
  const user = req.user;

  if (!comment_id) throw new ApiError(400, "Can't get comment id!!");
  if (!reply_id) throw new ApiError(400, "Can't get reply id!!");

  const comment = await Comment.findOne({ _id: comment_id });

  if (!comment) {
    throw new ApiError(400, "No Comment Found Related to given id!!");
  }

  const reply = comment.replies.id(reply_id);

  if (!reply) {
    throw new ApiError(400, "No Reply Found Related to given id!!");
  }

  const userIdString = user._id.toString();

  // Check if the user ID exists in the replyLikes array
  const userIndex = reply.replyCommentLikes.findIndex(id => id.toString() === userIdString);
  let state;
  if (userIndex !== -1) {
    // User ID exists, so remove it from the array
    reply.replyLikes.splice(userIndex, 1);
    console.log("user unliked the reply");
    state = 'unliked';
  } else {
    // User ID does not exist, so add it to the array (if you want to handle toggling)
    reply.replyCommentLikes.push(userIdString);
    console.log("user liked the reply");
    state = 'liked';
  }

  await comment.save();

  return res.status(201).json(new ApiResponse(200, comment, `Reply ${state} Successfully!!`));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getPostLike = asyncHandler(async (req, res) => {
  const { post_id } = req.body;

  const allPosts = await Like.find({ post: post_id }).populate("likedBy");

  const likeCount = await Like.aggregate([
    {
      $match: { post: new mongoose.Types.ObjectId(post_id) }, // Match the specific post ID
    },
    {
      $group: {
        _id: "$post",
        likeCount: { $sum: 1 },
      },
    },
  ]);

  console.log(likeCount[0] ? likeCount[0]?.likeCount : 0); // like count

  return res
    .status(201)
    .json(new ApiResponse(500, allPosts, "Got All likes!!"));
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { post_id } = req.body;
  const user = req.user;
  if (!post_id) {
    throw new ApiError(400, "Can't get post id");
  }

  const isPostExist = await Post.findOne({ _id: post_id });
  if (!isPostExist) {
    throw new ApiError(400, "Invalid Post!");
  }
  const isLiked = await Like.findOne({
    $and: [{ likedBy: user._id }, { post: post_id }],
  });

  if (isLiked) {
    const unLikeInstance = await Like.findOneAndDelete({
      $and: [{ likedBy: user._id }, { post: post_id }],
    });

    if (unLikeInstance) {
      return res
        .status(201)
        .json(
          new ApiResponse(200, unLikeInstance, "Post unliked Successfully!")
        );
    } else {
      throw new ApiError(500, "Something went worng in unliking the post!!");
    }
  }

  const newLikeInstance = await Like.create({
    post: post_id,
    likedBy: user._id,
  });

  if (!newLikeInstance)
    throw new ApiError(500, "Something went worng in Likeing the post!!");

  return res
    .status(201)
    .json(new ApiResponse(200, newLikeInstance, "Post Liked Successfully!!"));
});
export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getPostLike,
  togglePostLike,
  toggleReplyLike
};
