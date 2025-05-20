import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
import {
  createOrUpdateReview,
  deleteReview,
  getUserReviews,
  getUserAverageRating,
} from "../controllers/review.controllers.js";

const reviewRouter = Router();

// POST or PUT review (create/update)
reviewRouter.route("/:userId").post(verifyJWT, createOrUpdateReview);

// DELETE review
reviewRouter.route("/:reviewId").delete(verifyJWT, deleteReview);

// GET all reviews for a user
reviewRouter.route("/user/:userId").get(verifyJWT, getUserReviews);

// GET average rating for a user
reviewRouter.route("/user/:userId/average-rating").get(verifyJWT, getUserAverageRating);

export default reviewRouter;
