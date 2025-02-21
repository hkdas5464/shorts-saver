"use client";
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CategoryTabsAlt({ categories, savedVideos, setPlayingVideo }) {
  return (
    <Tab.Group>
      <Tab.List className="flex p-1 space-x-1 rounded-xl bg-blue-900/20">
        {categories.map((cat) => (
          <Tab
            key={cat}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                selected
                  ? "bg-white shadow text-blue-700"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            {cat}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {categories.map((cat) => (
          <Tab.Panel key={cat} className="p-3 bg-white rounded-xl">
            {savedVideos.filter(video => video.category.toLowerCase() === cat.toLowerCase()).length === 0 ? (
              <p className="text-center text-gray-600">No videos saved in {cat}.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {savedVideos
                  .filter(video => video.category.toLowerCase() === cat.toLowerCase())
                  .map((video, index) => (
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
                        <p className="font-semibold capitalize">
                          {video.subCategory || "No subcategory"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
