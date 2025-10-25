import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate likes per user per post
likeSchema.index({ user: 1, post: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);