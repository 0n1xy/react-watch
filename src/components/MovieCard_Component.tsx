import { useNavigate } from "react-router-dom";
import { IMovie } from "../types/Movie_Type"; // Import kiểu dữ liệu

const MovieCard = ({ movie }: { movie: IMovie }) => {
  const navigate = useNavigate();

  // Kiểm tra ảnh hợp lệ
  const imageUrl =
    movie.thumb_url ||
    movie.poster_url ||
    "https://via.placeholder.com/450x250";

  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer group"
      style={{
        width: "330px",
        height: "190px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "10px",
      }}
      onClick={() => navigate(`/movie/${movie.slug}`)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>

      {/* Nội dung phim */}
      <div className="absolute bottom-3 left-3 text-white">
        <h3 className="text-sm font-bold">{movie.name}</h3>
        <p className="text-xs text-gray-300 italic">{movie.original_name}</p>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
          <span>{movie.total_episodes || "N/A"} Tập</span>
          <span className="bg-blue-500 px-2 py-[2px] rounded text-white text-[10px]">
            {movie.language || "Vietsub"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
