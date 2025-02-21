import { useState } from "react";

export default function LinkForm({ onAddVideo }) {
  const [link, setLink] = useState("");

  const extractVideoId = (url) => {
    // Example for YouTube Shorts URL, e.g., "https://youtube.com/shorts/VIDEO_ID"
    const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(link);
    if (videoId) {
      onAddVideo(videoId);
      setLink("");
    } else {
      alert("Please enter a valid YouTube Shorts URL.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 my-4">
      <input
        type="text"
        placeholder="Enter YouTube Shorts link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full max-w-md px-4 py-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Save Video
      </button>
    </form>
  );
}
