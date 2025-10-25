import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema(
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

// Optional: prevent duplicate dislikes per user per post
dislikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const Dislike = mongoose.model("Dislike", dislikeSchema);
