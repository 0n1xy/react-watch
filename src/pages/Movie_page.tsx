import { Key, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IMovie } from "../types/Movie_Type"; // Import kiểu dữ liệu phim

const MoviePage = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL; // Lấy URL từ .env
        const apiUrl = `${baseUrl}/${slug}`; // Gắn `slug` vào URL API
        console.log("Fetching:", apiUrl); // Debug URL

        const response = await axios.get(apiUrl);
        setMovie(response.data.movie); // API trả về object có key `movie`
      } catch (err) {
        setError("Không thể tải thông tin phim.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMovie();
  }, [slug]);

  if (loading)
    return <div className="text-white text-center mt-10">Đang tải...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!movie) return null; // Tránh lỗi truy cập dữ liệu null

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${movie.poster_url})`,
        }}
      ></div>

      {/* Movie Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start p-10 gap-6">
        {/* Movie Poster */}
        <img
          src={movie.thumb_url}
          alt={movie.name}
          className="w-60 rounded-lg shadow-lg"
        />

        {/* Movie Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{movie.name}</h1>
          <h2 className="text-xl text-gray-400 italic">
            {movie.original_name}
          </h2>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-gray-400">
              {new Date(movie.created).getFullYear()}
            </span>
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              {movie.quality}
            </span>
            <span className="text-gray-400">{movie.total_episodes} Tập</span>
            <span className="text-gray-400">{movie.time}</span>
          </div>

          {/* Mô tả chi tiết */}
          <div
            className="mt-4 text-gray-300"
            dangerouslySetInnerHTML={{ __html: movie.description }}
          ></div>

          {/* Thông tin khác */}
          <div className="mt-4">
            <p>
              <strong>Ngôn ngữ:</strong> {movie.language}
            </p>
            {movie.director && (
              <p>
                <strong>Đạo diễn:</strong> {movie.director}
              </p>
            )}
            {movie.casts && (
              <p>
                <strong>Dàn diễn viên:</strong> {movie.casts}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-2"
              onClick={() =>
                window.open(movie.episodes?.[0]?.items?.[0]?.embed, "_blank")
              }
            >
              ▶ Play
            </button>
            {/* <button className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded">
              More information
            </button> */}
          </div>
        </div>
      </div>

      {/* Episodes - Hiển thị theo hàng ngang */}
      <div className="relative z-10 mt-6 px-10">
        <h2 className="text-xl font-bold mb-3">Episodes</h2>
        <div className="flex flex-wrap gap-3">
          {movie.episodes?.[0]?.items.map(
            (
              ep: { embed: string | undefined; name: any },
              index: Key | null | undefined
            ) => (
              <a
                key={index}
                href={ep.embed}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded text-center"
              >
                {`Tập ${ep.name}`}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
