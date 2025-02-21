"use client";
import { Button } from '@heroui/button';
import { Tabs, Tab, Card, CardBody, Image, CardFooter } from "@heroui/react";
import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';

export const DeleteIcon = ({ fill = "currentColor", size, height, width, ...props }) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CategoryTabs({ categories, savedVideos, setPlayingVideo }) {

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const handleDeleteVideo = async (id) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        mutate('/api/videos');
      } else {
        alert('Failed to delete video.');
      }
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl px-4">
        <Tabs aria-label="Dynamic tabs" items={categories} className="w-full" fullWidth="true" variant='bordered'>
          {categories.map((cat) => (
            <Tab key={cat} title={cat} className="w-full">
              {savedVideos.filter(video => (video.category || "").toLowerCase() === cat.toLowerCase()).length === 0 ? (
                <p className="text-center text-gray-600">No videos saved in {cat}.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {savedVideos
                    .filter(video => (video.category || "").toLowerCase() === cat.toLowerCase())
                    .map((video, index) => (
                      <Card
                        isPressable
                        key={index}
                        className="overflow-hidden transition duration-200 transform rounded shadow-lg cursor-pointer hover:scale-105"
                        onPress={() => setPlayingVideo(video.videoId)}
                      >
                                  <CardBody className="p-0 overflow-visible">

                        <Image
                        isBlurred
                          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                          alt={`Video Thumbnail - ${video.subCategory}`}
                          className="w-full object-cover h-[140px]"
                          radius="lg"
                          shadow="sm"
                          width="100%"
                        />
                        </CardBody>

                        <CardFooter className="justify-between text-small">
                        <b>{video.subCategory || 'No subcategory'}</b>
                          <Button isIconOnly color='danger' onPress={() => handleDeleteVideo(video._id)}>
                            <DeleteIcon />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
