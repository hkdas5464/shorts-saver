// models/Video.js
import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
