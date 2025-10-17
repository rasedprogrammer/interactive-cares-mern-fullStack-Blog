import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    tyep: String,
    required: true,
  },
  description: {
    tyep: String,
    resuired: true,
  },
  image: {
    tyep: String,
    default: "",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  auther: {
    type: String,
  },
  publishAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model("post", postSchema);
export default Post;
