export default function Gallery({ videos, onPlay }) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((videoId, index) => (
          <div
            key={index}
            className="overflow-hidden rounded shadow-lg cursor-pointer"
            onClick={() => onPlay(videoId)}
          >
            {/* YouTube thumbnail URL */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Video thumbnail"
              className="w-full"
            />
          </div>
        ))}
      </div>
    );
  }
  