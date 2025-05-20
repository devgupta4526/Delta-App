import Review from "../models/review.models.js";
import User from "../models/users.models.js";
import Pool from "../models/pool.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Create or update review
const createOrUpdateReview = asyncHandler(async (req, res) => {
    const reviewerId = req.user._id;
    const { revieweeId, poolId, rating, comment } = req.body;

    if (!revieweeId || !poolId || !rating) {
        throw new ApiError(400, "revieweeId, poolId and rating are required");
    }

    const existingReview = await Review.findOne({
        reviewer: reviewerId,
        reviewee: revieweeId,
        pool: poolId,
    });

    let review;

    if (existingReview) {
        existingReview.rating = rating;
        existingReview.comment = comment;
        review = await existingReview.save();
    } else {
        review = await Review.create({
            reviewer: reviewerId,
            reviewee: revieweeId,
            pool: poolId,
            rating,
            comment,
        });
    }

    res.status(200).json(new ApiResponse(200, review, "Review saved successfully"));
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
    const reviewerId = req.user._id;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) throw new ApiError(404, "Review not found");

    if (review.reviewer.toString() !== reviewerId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this review");
    }

    await review.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});

// Get all reviews for a user (reviewee)
const getUserReviews = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
        .populate("reviewer", "_id username fullName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
});

// Get average rating of a user
const getUserAverageRating = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const result = await Review.aggregate([
        { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
        {
              $group: {
            _id: "$reviewee",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 }
        }
        }
    ]);

    if (!result.length) {
        return res.status(200).json(new ApiResponse(200, { averageRating: 0, reviewCount: 0 }, "No reviews yet"));
    }

    const { averageRating, reviewCount } = result[0];
    res.status(200).json(new ApiResponse(200, { averageRating, reviewCount }, "Average rating fetched"));
});




export { getUserReviews,getUserAverageRating,createOrUpdateReview,deleteReview};
