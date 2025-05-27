import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js"
import User from "../models/users.models.js"
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/CloudinaryUtil.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    console.log("FILES RECEIVED:", req.files);

    // Validation
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    // Check if user already exists
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Handle image uploads
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    console.log("Avatar local path:", avatarLocalPath);
    console.log("Cover image local path:", coverImageLocalPath);

    // Upload to Cloudinary with better error handling
    let avatarUpload;
    let coverUpload = null;
    
    try {
        avatarUpload = await uploadOnCloudinary(avatarLocalPath);
        if (!avatarUpload) {
            throw new ApiError(500, "Failed to upload avatar to Cloudinary - upload returned null");
        }

        if (coverImageLocalPath) {
            coverUpload = await uploadOnCloudinary(coverImageLocalPath);
        }
    } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new ApiError(500, `Failed to upload images to Cloudinary: ${uploadError.message}`);
    }

    // Create user
    const user = await User.create({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password, 
        profilePicture: avatarUpload.url,
        coverImage: coverUpload?.url || "",
        username: username.trim().toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "username or email is required for login");
    }

    const user = await User.findOne({
        $or: [{ username: username?.toLowerCase() }, { email: email?.toLowerCase() }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const user = await User.findOne({ username }).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "User already logged out"));
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not found, please login again");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token does not match");
        }

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

export {
    generateAccessAndRefreshToken,
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    refreshAccessToken,
    getAllUsers
};
