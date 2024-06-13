import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";

const getPostComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { post_id } = req.params;

  // const {page = 1, limit = 10} = req.query

  if (!post_id) {
    throw new ApiError(400, "Can't get post id");
  }

  const isPostExist = await Post.findOne({ _id: post_id });
  if (!isPostExist) {
    throw new ApiError(400, "Invalid Post!");
  }

  const allPostComments = await Comment.find({ post: post_id }).populate(
    "commentBy"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(200, allPostComments, "got all Comments Successfully!!")
    );
});

const addComment = asyncHandler(async (req, res) => {

  
  // TODO: add a comment to a video
  const { content } = req.body;
  const { post_id } = req.params;
  const user = req.user;

  if ([content, post_id].some((fields) => fields.trim("") === "")) {
    throw new ApiError(400, "Can't get Comment content and Post Id!");
  }

  const newComment = await Comment.create({
    content,
    post: post_id,
    commentBy: user._id,
  });

  if (!newComment) {
    throw new ApiError(500, "Something went worng in creating new comment!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, newComment, "Comment added successfull!!"));
});

const replyToComment = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;
  const replyBy = req.user._id;

  if (!commentId || !content) {
    throw new ApiError(400, "Comment ID and content are required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const newReply = {
    content,
    replyBy,
  };

  comment.replies.push(newReply);
  await comment.save();

  return res.status(201).json(new ApiResponse(201, comment, "Reply added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
  replyToComment
};
