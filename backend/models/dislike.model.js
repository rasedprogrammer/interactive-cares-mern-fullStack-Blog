import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

dislikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const Dislike = mongoose.model("Dislike", dislikeSchema);
