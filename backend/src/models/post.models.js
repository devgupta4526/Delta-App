import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Array of URLs for images or videos
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

export default Post;
