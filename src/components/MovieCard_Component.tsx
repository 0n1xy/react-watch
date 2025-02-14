import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation

const MovieCard = ({
  name,
  original_name,
  thumb_url,
  slug,
  total_episodes,
  description,
  time,
  quality,
  language,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  return (
    <>
      {/* Movie Card */}
      <button
        onClick={() => setShowDetails(true)}
        className="relative bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
      >
        {/* Movie Image */}
        <img src={thumb_url} alt={name} className="w-full h-96 object-cover" />

        {/* Movie Info */}
        <div className="p-4 text-left">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-300">{original_name}</p>

          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p>
              <strong>Duration:</strong> {time || "Unknown"}
            </p>
            <p>
              <strong>Quality:</strong> {quality || "No data"}
            </p>
            <p>
              <strong>Language:</strong> {language || "Not available"}
            </p>
          </div>
        </div>
      </button>

      {/* Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl flex relative text-left">
            {/* Movie Image (Left Side) */}
            <div className="w-1/3">
              <img
                src={thumb_url}
                alt={name}
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* Movie Details (Right Side) */}
            <div className="w-2/3 pl-6 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <p className="text-gray-600 italic">{original_name}</p>
              <p className="mt-2 text-gray-700">{description}</p>

              {/* Movie Info */}
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>Duration:</strong> {time || "Unknown"}
                </p>
                <p>
                  <strong>Quality:</strong> {quality}
                </p>
                <p>
                  <strong>Language:</strong> {language}
                </p>
              </div>

              {/* Watch Movie Button */}
              <button
                onClick={() => navigate(`/movie/${slug}`)}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Watch Movie
              </button>

              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg self-start"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
