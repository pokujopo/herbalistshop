import { useState } from "react";

export default function PostForm() {
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState({
    youtube: false,
    facebook: false,
    x: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPlatforms = Object.keys(platforms).filter(
      (key) => platforms[key]
    );
    console.log({ videoUrl, caption, selectedPlatforms });
    // TODO: call backend API
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">
        New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-4">
          {["youtube", "facebook", "x"].map((plat) => (
            <label key={plat} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={platforms[plat]}
                onChange={(e) =>
                  setPlatforms({ ...platforms, [plat]: e.target.checked })
                }
                className="w-5 h-5 accent-orange-500"
              />
              {plat.charAt(0).toUpperCase() + plat.slice(1)}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}