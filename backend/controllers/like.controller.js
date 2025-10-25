import { Like } from "../models/like.model.js";

export const toggleLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const existing = await Like.findOne({ postId, userId });

    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      return res.json({ success: true, message: "Unliked successfully" });
    } else {
      await Like.create({ postId, userId });
      return res.json({ success: true, message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Like.countDocuments({ postId });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
