// pages/api/videos/[id].js
import dbConnect from '../../../lib/dbConnect';
import Video from '../../../models/Video';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query: { id } } = req;
  
  if (method === 'DELETE') {
    try {
      const deletedVideo = await Video.findByIdAndDelete(id);
      if (!deletedVideo) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }
      return res.status(200).json({ success: true, data: deletedVideo });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}
