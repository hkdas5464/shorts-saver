// pages/index.js
"use client";
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import VideoModal from '../components/VideoModal';
import CategoryTabs from '../components/CategoryTabs'; // (e.g., built using Headless UI Tabs as shown earlier)

// Define subcategories mapping
const subcategories = {
  Maths: [
    "Number System",
    "Arithmetic (Simplification, Percentage, Profit & Loss, Discount, Ratio & Proportion)",
    "Algebra (Linear Equations, Quadratic Equations)",
    "Geometry (Angles, Triangles, Circles, Area & Perimeter)",
    "Mensuration (Surface Area, Volume, 2D and 3D figures)",
    "Trigonometry (Sine, Cosine, Tan, Heights and Distances)",
    "Data Interpretation (Bar Graphs, Pie Charts, Line Graphs)",
    "Time & Work",
    "Time & Distance",
    "Simple & Compound Interest",
    "Average",
    "Speed, Distance, and Time",
    "Mixtures & Allegations"
  ],
  English: [
    "Reading Comprehension",
    "Sentence Improvement",
    "Error Spotting",
    "Synonyms and Antonyms",
    "One Word Substitution",
    "Idioms and Phrases",
    "Active and Passive Voice",
    "Direct and Indirect Speech",
    "Fill in the Blanks",
    "Cloze Test",
    "Sentence Rearrangement",
    "Spelling/Grammar Correction",
    "Vocabulary",
    "Para Jumbles"
  ],
  Reasoning: [
    "Analogy",
    "Series (Number, Alphabet, and Letter)",
    "Odd One Out",
    "Coding-Decoding",
    "Blood Relations",
    "Direction Sense Test",
    "Ranking and Ordering",
    "Syllogism",
    "Venn Diagrams",
    "Classification",
    "Statement and Conclusion",
    "Statement and Assumptions",
    "Seating Arrangement",
    "Input-Output",
    "Clock and Calendar",
    "Mirror & Water Image",
    "Figure Series and Analogies"
  ],
  GK: ["Static", "General"]
};

const fetcher = url => fetch(url).then(res => res.json());

export default function Home() {
  const [videoLink, setVideoLink] = useState('');
  const [category, setCategory] = useState('Maths');
  const [subCategory, setSubCategory] = useState(subcategories['Maths'][0]);
  const [playingVideo, setPlayingVideo] = useState(null);

  // Fetch videos from API using SWR
  const { data, error } = useSWR('/api/videos', fetcher, { refreshInterval: 5000 });
  const savedVideos = data?.data || [];

  // When category changes, update subcategory default
  useEffect(() => {
    setSubCategory(subcategories[category][0]);
  }, [category]);

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    let videoId = null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      } else if (parsedUrl.pathname.includes('/shorts/')) {
        videoId = parsedUrl.pathname.split('/shorts/')[1];
      } else {
        videoId = parsedUrl.searchParams.get('v');
      }
    } catch (error) {
      console.error('Invalid URL');
    }
    return videoId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vidId = extractVideoId(videoLink);
    if (vidId) {
      const newVideo = { videoId: vidId, category, subCategory };
      // Send a POST request to the API to save the video
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        // Revalidate the SWR cache
        mutate('/api/videos');
        setVideoLink('');
      } else {
        alert('Failed to save video.');
      }
    } else {
      alert('Please enter a valid YouTube link.');
    }
  };

  // Array of main categories for tabs
  const categories = ["Maths", "English", "Reasoning", "GK"];

  if (error) return <p className="mt-8 text-center">Failed to load videos</p>;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">YouTube Video Saver</h1>
      
      {/* Video Submission Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Enter YouTube video link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <label className="block mb-1 font-semibold">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        >
          {Object.keys(subcategories).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <label className="block mb-1 font-semibold">Subcategory:</label>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        >
          {subcategories[category].map((sub, index) => (
            <option key={index} value={sub}>{sub}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Save Video
        </button>
      </form>

      {/* Use Headless UI Tabs for Category View */}
      <CategoryTabs 
        categories={categories} 
        savedVideos={savedVideos} 
        setPlayingVideo={setPlayingVideo} 
      />

      {/* Video Modal */}
      {playingVideo && (
        <VideoModal playingVideo={playingVideo} setPlayingVideo={setPlayingVideo} />
      )}
    </div>
  );
}
