import mongoose from "mongoose";
import joinRequestSchema from './joinRequest.models.js'

const poolSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Pool name is required'],
      trim: true,
      minlength: [3, 'Pool name must be at least 3 characters'],
      maxlength: [100, 'Pool name must not exceed 100 characters'],
    },
    description: {
      overview: {
        type: String,
        trim: true,
        maxlength: 500,
        required: [true, 'Overview is required'],
      },
      activities: [{
        type: String,
        trim: true,
        maxlength: 100,
      }],
      requirements: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      additionalInfo: {
        type: String,
        trim: true,
        maxlength: 300,
      }
    },
    location: {
      type: String,
      enum: ['Point'],
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location must not exceed 200 characters'],
    },
    coordinates: {
      type: [Number],
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Date and time of the pool is required'],
    },
    maxMembers: {
      type: Number,
      required: [true, 'Maximum number of members is required'],
      min: [2, 'Pool must have at least 2 members'],
      max: [100, 'Pool cannot have more than 100 members'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pool creator is required'],
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    joinRequests: [joinRequestSchema],
    status: {
      type: String,
      enum: ['open', 'closed', 'cancelled'],
      default: 'open',
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 50,
    }],
    coverImage: {
      type: String,
      trim: true,
    }
  }, { timestamps: true });


  poolSchema.index({ location: "2dsphere" })
  

  const Pool = mongoose.model("Pool",poolSchema);

  export default Pool;