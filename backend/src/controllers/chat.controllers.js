import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pool from "../models/pool.models.js";
import Message from "../models/message.models.js";


const sendMessage = asyncHandler(async (req,res) =>{
      const {poolId} = req.params;
      const {content} = req.body;
      const userId = req.user._id;

      if (!poolId || poolId.length !== 24) {
        throw new ApiError(400, "Invalid pool ID");
      }
    
      if (!content || content.trim() === "") {
        throw new ApiError(400, "Message content cannot be empty");
      }
    
      const pool = await Pool.findById(poolId);
    
      if (!pool) {
        throw new ApiError(404, "Pool not found");
      }

      const isMember = pool.members.includes(userId) || pool.creator.toString() === userId.toString();
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pool");
  }

    const message = await Message.create({
        sender: userId,
        content,
        poolId: poolId,
        seenBy: [userId], // sender sees it by default
    });

    if(!message){
        throw new ApiError(500,"Message is not created");
    }

    const populatedMessage = await message.populate("sender", "name avatar email");

  res.status(201).json(
    new ApiResponse(201, "Message sent successfully", populatedMessage)
  );
});



const getAllMessages = asyncHandler(async (req,res)=>{
      const {poolId} = req.params;
      const userId = req.user._id;

      if (!poolId || poolId.length !== 24) {
        throw new ApiError(400, "Invalid pool ID");
      }

      const pool = await Pool.findById(poolId);
      if (!pool) {
        throw new ApiError(404, "Pool not found");
      }

      const isMember = pool.members.includes(userId) || pool.creator.toString() === userId.toString();
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pool");
  }

  const messages = await Message.find({ poolId: poolId })
    .sort({ createdAt: 1 }) // Oldest first
    .populate("sender", "name avatar email");

    res.status(200).json(
      new ApiResponse(200, "Messages fetched successfully", {
        count: messages.length,
        messages
      })
    );
});


const markMessageAsSeen = asyncHandler(async (req,res)=>{
      const {poolId} = req.params;
      const userId = req.user._id;

      if (!poolId || poolId.length !== 24) {
        throw new ApiError(400, "Invalid pool ID");
      }
    
      const pool = await Pool.findById(poolId);
      if (!pool) {
        throw new ApiError(404, "Pool not found");
      }
    
      const isMember = pool.members.includes(userId) || pool.creator.toString() === userId.toString();
      if (!isMember) {
        throw new ApiError(403, "You are not a member of this pool");
      }


      // Update all messages where user hasn't seen yet
  const result = await Message.updateMany(
    {
      poolId: poolId,
      seenBy: { $ne: userId }
    },
    {
      $addToSet: { seenBy: userId }
    }
  );

  res.status(200).json(
    new ApiResponse(200, "Messages marked as seen", {
      updatedCount: result.modifiedCount
    })
  );
});


const getUnreadMessageCounts = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    // Get all pools the user is part of
  const userPools = await Pool.find({
    $or: [{ creator: userId }, { members: userId }],
  }).select("_id");

  const unreadCounts = {};

  for (const pool of userPools) {
    const count = await Message.countDocuments({
      pool: pool._id,
      seenBy: { $ne: userId },
    });
    unreadCounts[pool._id] = count;
  }

  res.status(200).json(
    new ApiResponse(200, "Unread message counts fetched", unreadCounts)
  );
});


const deleteMessage = asyncHandler(async (req,res)=>{
    const {messageId} = req.params;
    const userId = req.user._id;

    if (!messageId || messageId.length !== 24) {
      throw new ApiError(400, "Invalid Message ID");
    }
  
    const message = await Message.findById(messageId);
  
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
  
    if (message.sender.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to delete this message");
    }
  
    message.isDeleted = true;
    await message.save();
  
    res.status(200).json(
      new ApiResponse(200, "Message deleted successfully")
    );
});

const editMessage = asyncHandler(async (req,res)=>{
  const { id: messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!messageId || messageId.length !== 24) {
    throw new ApiError(400, "Invalid message ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Edited content cannot be empty");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to edit this message");
  }

  message.content = content;
  message.isEdited = true;
  message.editedAt = new Date();

  await message.save();

  const updatedMessage = await message.populate("sender", "name avatar email");

  res.status(200).json(
    new ApiResponse(200, "Message edited successfully", updatedMessage)
  );
});

const replyToMessage = asyncHandler(async (req, res) => {
  const { poolId } = req.params;
  const { content, replyTo } = req.body;
  const userId = req.user._id;

  if (!poolId || poolId.length !== 24) {
    throw new ApiError(400, "Invalid pool ID");
  }

  if (!replyTo || replyTo.length !== 24) {
    throw new ApiError(400, "Invalid replyTo message ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Reply content cannot be empty");
  }

  const pool = await Pool.findById(poolId);
  if (!pool) {
    throw new ApiError(404, "Pool not found");
  }

  const isMember = pool.members.includes(userId) || pool.creator.toString() === userId.toString();
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pool");
  }

  const originalMessage = await Message.findById(replyTo);
  if (!originalMessage || originalMessage.poolId.toString() !== poolId) {
    throw new ApiError(404, "Original message not found in this pool");
  }

  const message = await Message.create({
    sender: userId,
    content,
    poolId,
    seenBy: [userId],
    replyTo,
  });

  const populatedMessage = await Message.findById(message._id)
  .populate("sender", "name avatar email")
  .populate({
    path: "replyTo",
    populate: { path: "sender", select: "name avatar email" }
  });


  res.status(201).json(
    new ApiResponse(201, "Reply sent successfully", populatedMessage)
  );
});


export {
  sendMessage,
  getAllMessages,
  markMessageAsSeen,
  getUnreadMessageCounts,
  deleteMessage,
  editMessage,
  replyToMessage
};