import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // To ensure no trailing spaces
        minlength: [3, 'Username should be at least 3 characters long.'],
        maxlength: [20, 'Username should be at most 20 characters long.'],
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    refreshToken: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // For uniformity in case
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'], // Simple regex for validation
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password should be at least 6 characters long.'],
    },
    profilePicture: {
        type: String,
        default: 'default.jpg',
    },
    coverImage: {
        type: String,
        default: 'default1.jpg',
    },
    bio: {
        type: String,
        default: '',
        maxlength: [250, 'Bio should be at most 250 characters long.'],
    },
    phone: {
        type: String,
        default: '',
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number.'], // E.164 format validation
    },
    score: {
        type: Number,
        default: 100,
        min: [0, 'Score cannot be less than 0'],
    },
    attendedPools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pool', // Reference to pools the user has attended
    }],
    createdPools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pool', // Pools created by the user
    }],
    joinedPools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pool', // Pools the user has joined
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to posts made by the user about pools
    }],
    joinRequests: [{
        poolId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pool', // Pools the user has sent join requests for
        },
        status: { 
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification', // Reference to notifications sent to the user
    }],
    chatGroups: [{
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatGroup', // Chat group the user is part of
        },
        lastReadMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message', // Last read message in the group
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    roles: {
        type: [String],
        enum: ['user', 'admin', 'premium', 'verified'], // Expandable for future roles
        default: ['user'], // Default role is user
    },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active', // User can be suspended or inactive in the future
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'verified', 'pending'], // Can be expanded in future
        default: 'unverified',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


// Middleware to update `updatedAt` field whenever the document is modified
userSchema.pre('save',async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    this.updatedAt = Date.now();
    next();
});

// Optional: Virtual fields for future use (e.g., full name)
// userSchema.virtual('fullName').get(function () {
//     return `${this.firstName} ${this.lastName}`;
// });

// Instance method to check if user is a premium member
userSchema.methods.isPremium = function () {
    return this.roles.includes('premium');
};

// Static method to get a user by email
userSchema.statics.findByEmail = async function (email) {
    return await this.findOne({ email: email });
};


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Create the User Model
const User = mongoose.model('User', userSchema);

export default User;