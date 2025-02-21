// pages/api/videos.js
import dbConnect from '../../lib/dbConnect';
import Video from '../../models/Video';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  if (method === 'GET') {
    try {
      const videos = await Video.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: videos });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const video = await Video.create(req.body);
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false, error: "Method not allowed" });
  }
}
