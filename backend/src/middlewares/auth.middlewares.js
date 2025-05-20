import jwt from "jsonwebtoken";
import  User  from "../models/users.models.js";
import ApiError  from "../utils/ApiError.js";
import {asyncHandler}  from "../utils/AsyncHandler.js";
import logger from "../utils/Logger.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token from header/cookie:", token);
        if (!token) {
            logger.warn("No token provided in the request.");
            throw new ApiError(401, "Unauthorized request: No token provided.");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded token:", decodedToken);
        // Check if the token is valid and retrieve user
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            logger.warn(`User not found for decoded token id: ${decodedToken._id}`);
            throw new ApiError(401, "Invalid Access Token: User does not exist.");
        }

        // Attach user to the request object for use in other middlewares/controllers
        req.user = user;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        // Log error and respond with a detailed message
        logger.error(`JWT verification failed: ${error?.message}`);
        throw new ApiError(401, error?.message || "Invalid access token or session expired.");
    }
});


export default verifyJWT;