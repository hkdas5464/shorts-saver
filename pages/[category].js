// pages/[category].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoModal from '../components/VideoModal';

// Valid categories must match the keys in subcategories (capitalized)
const validCategories = ["Maths", "English", "Reasoning", "GK"];

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && category) {
      const storedVideos = localStorage.getItem('savedVideos');
      if (storedVideos) {
        const allVideos = JSON.parse(storedVideos);
        // Convert category from URL (lowercase) to capitalized for comparison
        const capCategory = category.charAt(0).toUpperCase() + category.slice(1);
        if (validCategories.includes(capCategory)) {
          setVideos(allVideos.filter(video => video.category === capCategory));
        }
      }
    }
  }, [category]);

  if (!category || !validCategories.includes(category.charAt(0).toUpperCase() + category.slice(1))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl">Invalid Category</p>
        <Link href="/">
          <span className="mt-4 text-blue-600 underline">Go back Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Link href="/">
        <span className="inline-block mb-4 text-blue-600 underline">← Home</span>
      </Link>
      <h1 className="mb-6 text-3xl font-bold text-center capitalize">{category} Videos</h1>
      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos saved in {category}.</p>
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
