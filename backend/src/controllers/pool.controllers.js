import Pool from '../models/pool.models.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/AsyncHandler.js'
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import logger from "../utils/Logger.js";
import { sendJoinPoolEmail } from '../utils/email.utils.js';
import User from '../models/users.models.js';


const getUserPoolLimit = (user) => {
    if (user.isPremium()) {
        return 10;
    }
    else {
        return 3;
    }
}


const createPool = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        location,
        date,
        maxMembers,
        tags,
        coverImage
    } = req.body;

    if (!name || !description || !location || !date || !maxMembers) {
        throw new ApiError(400, "All mandatory fields must be provided.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const poolLimit = getUserPoolLimit(user);
    if (!poolLimit) {
        throw new ApiError(500, "Something went wrong");
    }
    const userCreatedPoolsCount = user.createdPools.length;

    if (userCreatedPoolsCount >= poolLimit) {
        throw new ApiError(400, `You have reached your limit of ${poolLimit} pool(s). Upgrade to premium to create more.`);
    }

    const poolStartDate = new Date(date);
    const poolEndDate = new Date(poolStartDate.getTime() + 60 * 60 * 1000);

    // Check if there is any overlapping pool for the same user
    const overlappingPool = await Pool.findOne({
        creator: req.user._id,
        date: { $gte: poolStartDate, $lt: poolEndDate } // Check if the new pool overlaps with an existing one
    });

    if (overlappingPool) {
        throw new ApiError(400, "You already have a pool created during this time. Please choose another time.");
    }

    // Check if any other user's pool has overlapping time with this pool at the same location
    const conflictingPool = await Pool.findOne({
        location,
        date: { $gte: poolStartDate, $lt: poolEndDate } // Check for overlap
    });

    if (conflictingPool) {
        throw new ApiError(400, "There is already a pool at the same location during this time. Please choose another time or location.");
    }
// In your createPool function, replace the coverImage handling with:
let coverImageUrl = null;
if (req.file) {
    const coverUpload = await uploadOnCloudinary(req.file.path);
    if (!coverUpload) {
        throw new ApiError(500, "Failed to upload cover image to Cloudinary");
    }
    coverImageUrl = coverUpload.secure_url;
} else if (req.body.coverImage) {
    // If coverImage URL is provided directly
    coverImageUrl = req.body.coverImage;
}

// Then in your Pool.create():
const pool = await Pool.create({
    name,
    description,
    location,
    date,
    maxMembers,
    creator: req.user._id,
    members: [req.user._id],
    tags,
    coverImage: coverImageUrl
});
    if (!pool) {
        throw new ApiError(400, "Pool did not get created");
    }

    const createdPool = await Pool.findById(pool._id);
    if (!createdPool) {
        throw new ApiError(400, "Pool Did not get created cant find pool");
    }

    user.createdPools.push(pool._id);
    await user.save();

    logger.info(`New pool created by user ${req.user._id} with id ${pool._id}`);

    // Return response with the newly created pool
    res.status(201).json(new ApiResponse(200, "Pool created successfully.", pool));

});



const getAllPools = asyncHandler(async (req, res) => {
    //Pagination defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    //Filters
    const { location, date, tag } = req.query;
    const filters = { status: 'open' };

    if (location) {
        filters.location = { $regex: location, $options: 'i' };
    }

    if (tag) {
        filters.tags = { $in: [tag] };
    }

    if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
            filters.date = { $gte: parsedDate };
        }
    }

    // Fetch pools
    const pools = await Pool.find(filters)
        .populate('creator', 'name email') // You can add profilePic later
        .sort({ date: 1 }) // Soonest event first
        .skip(skip)
        .limit(limit);

    const total = await Pool.countDocuments(filters);

    res.status(200).json(new ApiResponse(200, "Pools fetched succesfully", {
        total,
        page,
        limit,
        pools
    }));
});


const getPoolById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || id.length != 24) {
        throw new ApiError(400, 'Invalid Pool ID');
    }

    const pool = await Pool.findById(id)
        .populate('creator', 'name email')
        .populate('members', 'name email')
        .exec();


    if (!pool) {
        throw new ApiError(404, 'Pool not found');
    }

    res.status(200).json(new ApiResponse(200, 'Pool fetched successfully', pool));
});


const sendJoinRequest = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;

    if (!poolId || poolId.length !== 24) {
        throw new ApiError(400, 'Invalid Pool ID');
    }

    const pool = await Pool.findById(poolId);
    if (!pool) {
        throw new ApiError(404, 'Pool not found');
    }

    if (pool.status !== 'open') {
        throw new ApiError(400, 'Cannot join a closed or cancelled pool');
    }

    if (pool.members.includes(userId)) {
        throw new ApiError(400, 'You are already a member of this pool');
    }

    const alreadyRequested = pool.joinRequests.some(
        (req) => req.user.toString() === userId.toString()
    );

    if (alreadyRequested) {
        throw new ApiError(400, 'You have already requested to join this pool');
    }

    const updatedPool = pool.joinRequests.push({
        user: userId,
        message: message || '',
    });

    await pool.save();

    // const createdRequest = updatedPool.joinRequests.find(
    //     (req) => req.user.toString() === userId.toString()
    // );

    // if (!createdRequest) {
    //     throw new ApiError(500, 'Failed to save join request. Please try again.');
    // }

    res.status(200).json(new ApiResponse(200, 'Join request sent successfully'));

});


const withdrawJoinRequest = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;

    const userId = req.user._id;

    if (!poolId || poolId.length != 24) {
        throw new ApiError(400, 'Invalid Pool Id');
    }

    if (!userId) {
        throw new ApiError(404, 'user Not found');
    }

    const pool = await Pool.findById(poolId);
    if (!pool) {
        throw new ApiError(404, "Pool not found");
    }

    // Ensure pool is still open
    if (pool.status !== 'open') {
        throw new ApiError(400, 'Cannot withdraw from a closed or cancelled pool');
    }

    // Check if user is already a member — withdrawing makes no sense then
    if (pool.members.includes(userId)) {
        throw new ApiError(400, 'You are already a member of this pool');
    }

    // Find join request by this user
    const requestIndex = await pool.joinRequests.findIndex(
        (request) => request.user.toString() === userId.toString()
    );

    if (requestIndex === -1) {
        throw new ApiError(400, 'No join request found to withdraw');
    }

    // Remove join request
    pool.joinRequests.splice(requestIndex, 1);
    await pool.save();

    res.status(200).json(
        new ApiResponse(200, 'Join request withdrawn successfully', {
            poolId,
            userId,
        })
    );
});


const viewJoinRequests = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;
    const userId = req.user._id;

    if (!poolId || poolId.length != 24) {
        throw new ApiError(400, 'Invalid Pool Id');
    }

    if (!userId) {
        throw new ApiError(404, 'user Not found');
    }

    // 2. Find Pool and populate user info in join requests
    const pool = await Pool.findById(poolId)
        .populate({
            path: 'joinRequests.user',
            select: 'name email avatar reputation', // Adjust fields as needed
        });

    if (!pool) {
        throw new ApiError(404, 'Pool not found');
    }

    // 3. Check if user is the creator
    if (pool.creator.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to view join requests for this pool');
    }

    // 4. Return joinRequests
    res.status(200).json(
        new ApiResponse(200, 'Join requests fetched successfully', {
            totalRequests: pool.joinRequests.length,
            joinRequests: pool.joinRequests,
        })
    );

});

const acceptJoinRequest = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;
    const { userId } = req.body;
    const creatorId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(poolId) ||
        !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, 'Invalid Pool ID or User ID');
    }

    const pool = await Pool.findById(poolId);
    if (!pool) {
        throw new ApiError(404, "Error:Pool not found");
    }

    if (pool.creator.toString() !== creatorId.toString()) {
        throw new ApiError(403, 'Only the pool creator can accept join requests');
    }

    const requestIndex = pool.joinRequests.findIndex(
        req => req.user.toString() === userId
    );

    if (requestIndex === -1) {
        throw new ApiError(400, 'No such join request exists');
    }

    if (pool.members.includes(userId)) {
        throw new ApiError(400, 'User is already a member of the pool');
    }

    if (pool.members.length >= pool.maxMembers) {
        throw new ApiError(400, 'Pool has reached its maximum member limit');
    }

    // Add user to members
    pool.members.push(userId);
    // Remove from joinRequests
    pool.joinRequests.splice(requestIndex, 1);

    await pool.save();

    res.status(200).json(
        new ApiResponse(200, 'User accepted into pool successfully', { memberId: userId })
    );
});


const rejectJoinRequests = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;
    const { userId } = req.body;
    const creatorId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(poolId) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, 'Invalid Pool ID or User ID');
    }

    const pool = await Pool.findById(poolId);
    if (!pool) throw new ApiError(404, 'Pool not found');

    if (pool.creator.toString() !== creatorId.toString()) {
        throw new ApiError(403, 'Only the pool creator can reject join requests');
    }

    const requestIndex = pool.joinRequests.findIndex(req => req.user.toString() === userId);
    if (requestIndex === -1) {
        throw new ApiError(400, 'No such join request exists');
    }

    // Remove from joinRequests
    pool.joinRequests.splice(requestIndex, 1);

    await pool.save();

    res.status(200).json(
        new ApiResponse(200, 'Join request rejected successfully', { rejectedUserId: userId })
    );
});


const updatePoolStatus = asyncHandler(async (req, res) => {
    const { id: poolId } = req.params;
    const userId = req.user._id;
    const { status } = req.body;

    // Validate input
    if (!poolId || poolId.length !== 24) {
        throw new ApiError(400, 'Invalid Pool ID');
    }

    if (!['open', 'closed', 'cancelled'].includes(status)) {
        throw new ApiError(400, 'Invalid status value. Must be open, closed, or cancelled.');
    }

    // Find pool
    const pool = await Pool.findById(poolId);
    if (!pool) {
        throw new ApiError(404, 'Pool not found');
    }

    // Check permission
    if (pool.creator.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to update this pool status');
    }

    // Prevent reopening a cancelled pool (optional rule)
    if (pool.status === 'cancelled' && status === 'open') {
        throw new ApiError(400, 'Cancelled pools cannot be reopened');
    }

    // Update status
    pool.status = status;
    await pool.save();

    res.status(200).json(
        new ApiResponse(200, `Pool status updated to "${status}"`, {
            poolId: pool._id,
            newStatus: pool.status,
        })
    );
});

const discoverPools = asyncHandler(async (req, res) => {
    const { tags, date, lat, lng, distance } = req.query;
  
    const query = {
      isOpen: true,
      eventDate: { $gte: date ? new Date(date) : new Date() } // default: today onward
    };
  
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagsArray };
    }
  
    if (lat && lng && distance) {
      const radius = parseFloat(distance) / 6378.1; // Earth's radius in km
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius],
        },
      };
    }
  
    const pools = await Pool.find(query)
      .sort({ eventDate: 1 })
      .limit(50);
  
    res.status(200).json(new ApiResponse(200, "Pools discovered", pools));
  });


export {
    createPool,
    getAllPools,
    getPoolById,
    sendJoinRequest,
    withdrawJoinRequest,
    viewJoinRequests,
    acceptJoinRequest,
    rejectJoinRequests,
    updatePoolStatus,
    discoverPools
};