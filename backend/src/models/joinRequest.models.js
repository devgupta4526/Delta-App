// joinRequest.models.js
import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

export default joinRequestSchema; // NOT a model
