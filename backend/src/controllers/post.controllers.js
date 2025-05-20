import Post from "../models/post.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { poolId, content, media } = req.body;
  const userId = req.user._id;

  if (!content.trim() && !media?.length) {
    throw new ApiError(400, "Content or media is required");
  }

  const post = await Post.create({
    user: userId,
    pool: poolId,
    content,
    media,
  });

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// Get all posts for a specific pool
const getPostsByPool = asyncHandler(async (req, res) => {
  const { poolId } = req.params;

  const posts = await Post.find({ pool: poolId })
    .populate("user", "username fullName")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// Like a post
const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  // Check if the user has already liked the post
  if (post.likes.includes(userId)) {
    return res.status(400).json(new ApiResponse(400, null, "You already liked this post"));
  }

  post.likes.push(userId);
  await post.save();

  res.status(200).json(new ApiResponse(200, post, "Post liked successfully"));
});

// Comment on a post
const commentOnPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (!content.trim()) throw new ApiError(400, "Comment content is required");

  post.comments.push({
    user: userId,
    content,
  });

  await post.save();

  res.status(200).json(new ApiResponse(200, post, "Comment added successfully"));
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName avatar username")
    .populate("pool", "title location category");

  return res.status(200).json(new ApiResponse(200, posts, "Feed fetched successfully"));
});

export { createPost, getPostsByPool, likePost, commentOnPost,getFeedPosts };
