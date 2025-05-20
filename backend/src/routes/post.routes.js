import { Router } from 'express';
import verifyJWT from "../middlewares/auth.middlewares.js";
import { createPost, getPostsByPool, likePost, commentOnPost, getFeedPosts } from '../controllers/post.controllers.js';

const postRouter = Router();

// Create a new post
postRouter.route("/create").post(verifyJWT, createPost);

// Get all posts for a specific pool
postRouter.route("/pool/:poolId").get(getPostsByPool);

// Like a post
postRouter.route("/:postId/like").post(verifyJWT, likePost);

// Comment on a post
postRouter.route("/:postId/comment").post(verifyJWT, commentOnPost);

//Feed Post
postRouter.route('/feed').get(verifyJWT,getFeedPosts);

export default postRouter;
