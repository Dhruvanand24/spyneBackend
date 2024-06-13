import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    replyBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    replyLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        content: {
          type: String,
          required: true,
        },
        replyBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        replyCommentLikes: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ], // Embedding replies as an array of replySchema
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
