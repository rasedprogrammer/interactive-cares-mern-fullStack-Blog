import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    // Author ID reference can be added later
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  // Category reference can be added later
  // Comments reference can be added later
  // Likes Dislikes can be added later
  publishAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model("post", postSchema);
export default Post;
