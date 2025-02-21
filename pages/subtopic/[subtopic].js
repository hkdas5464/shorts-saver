// pages/subtopic/[subtopic].js
import dbConnect from '../../lib/dbConnect';
import Video from '../../models/Video';
import Link from 'next/link';
import { useState } from 'react';
import VideoModal from '../../components/VideoModal';

export async function getServerSideProps(context) {
  const { subtopic } = context.params;
  await dbConnect();

  // Use a case-insensitive regular expression to match the subcategory.
  const videos = await Video.find({
    subCategory: { $regex: subtopic, $options: 'i' }
  }).sort({ createdAt: -1 }).lean();

  // Convert ObjectId and Date to strings for serialization
  const videosFormatted = videos.map(video => ({
    ...video,
    _id: video._id.toString(),
    createdAt: video.createdAt.toISOString(),
  }));

  return { props: { videos: videosFormatted, subtopic } };
}

export default function SubtopicPage({ videos, subtopic }) {
  const [playingVideo, setPlayingVideo] = useState(null);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Link href="/">
        <span className="inline-block mb-4 text-blue-600 underline">← Home</span>
      </Link>
      <h1 className="mb-6 text-3xl font-bold text-center">
        Videos for: <span className="capitalize">{subtopic}</span>
      </h1>
      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos found for "{subtopic}".</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="overflow-hidden transition duration-200 transform rounded shadow-lg cursor-pointer hover:scale-105"
              onClick={() => setPlayingVideo(video.videoId)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={`Video Thumbnail - ${video.subCategory}`}
                className="w-full"
              />
              <div className="p-2 bg-white">
                <p className="font-semibold capitalize">{video.subCategory || 'No subcategory'}</p>
                <p className="text-sm text-gray-500 capitalize">{video.category || 'No category'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {playingVideo && (
        <VideoModal playingVideo={playingVideo} setPlayingVideo={setPlayingVideo} />
      )}
    </div>
  );
}
