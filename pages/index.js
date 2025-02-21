"use client";
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import VideoModal from '../components/VideoModal';
import CategoryTabs from '../components/CategoryTabs'; // (e.g., built using Headless UI Tabs as shown earlier)
import { Button } from '@heroui/button';
import { Spinner } from "@heroui/react";
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';

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
    "Digital Sum",
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
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // "success" or "error"

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
    setLoading(true);
    setFeedbackMessage('');
    const vidId = extractVideoId(videoLink);
    if (vidId) {
      const newVideo = { videoId: vidId, category, subCategory };
      try {
        const res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVideo)
        });
        if (res.ok) {
          // Revalidate the SWR cache
          mutate('/api/videos');
          setVideoLink('');
          setFeedbackMessage("Video saved successfully!");
          setFeedbackType("success");
        } else {
          setFeedbackMessage("Failed to save video.");
          setFeedbackType("error");
        }
      } catch (err) {
        setFeedbackMessage("Failed to save video.");
        setFeedbackType("error");
      } finally {
        setLoading(false);
      }
    } else {
      setFeedbackMessage("Please enter a valid YouTube link.");
      setFeedbackType("error");
      setLoading(false);
    }
  };

  // Array of main categories for tabs
  const categories = ["Maths", "English", "Reasoning", "GK"];

  if (error) return <p className="mt-8 text-center">Failed to load videos</p>;

  return (
    <div className="text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-red-600">YouTube Video Saver</h1>
      
      {/* Video Submission Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Enter YouTube video link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-full px-4 py-2 mb-4"
        />
        <Select
          value={category}
          label="Select Subject"
          defaultSelectedKeys={["Maths"]}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4"
        >
          {Object.keys(subcategories).map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </Select>
        <Select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4"
        >
          {subcategories[category].map((sub) => (
            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
          ))}
        </Select>
        <Button
          type="submit"
          color='success'
          className="w-full transition"
          disabled={loading}
        >
          {loading ? <Spinner  variant="spinner" />
: "Save Video"}
        </Button>
        {feedbackMessage && (
          <p className={`mt-2 text-center ${feedbackType === "success" ? "text-green-500" : "text-red-500"}`}>
            {feedbackMessage}
          </p>
        )}
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
