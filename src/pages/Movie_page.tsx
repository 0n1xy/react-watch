import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IMovie } from "../types/Movie_Type";
import NavComponent from "../components/Nav_component";

const MoviePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");
        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
        const apiUrl = `${baseUrl}/${slug}`;

        const response = await axios.get(apiUrl);
        setMovie(response.data.movie);
      } catch (err) {
        setError("Không thể tải thông tin phim.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMovie();
  }, [slug]);

  // 🔥 Sửa lỗi: Đặt `useMemo` TRƯỚC return
  const episodeList = useMemo(() => {
    if (!movie?.episodes) return null;
    return movie.episodes.map((server, serverIndex) => (
      <div key={serverIndex} className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          {server.server_name}
        </h3>

        {/* 🔥 Giảm xuống 8 tập trên 1 hàng ở desktop */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {server.items.map((ep) => (
            <button
              key={ep.slug}
              onClick={() => navigate(`/watch/${movie.slug}/${ep.slug}`)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm md:text-base font-bold rounded text-center"
            >
              {`Tập ${ep.name}`}
            </button>
          ))}
        </div>
      </div>
    ));
  }, [movie, navigate]);

  // ⏳ Nếu đang tải, hiển thị loading
  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-white text-xl animate-pulse">🎬 Đang tải...</div>
      </div>
    );
  }

  // ❌ Nếu có lỗi, hiển thị thông báo
  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  // ⚠️ Nếu không có dữ liệu, tránh lỗi truy cập dữ liệu null
  if (!movie) return null;

  return (
    <>
      <NavComponent />
      <div className="relative min-h-screen bg-black text-white overflow-y-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${movie.poster_url})` }}
        ></div>

        {/* Movie Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start p-5 md:p-10 gap-6">
          {/* Movie Poster */}
          <img
            src={movie.thumb_url}
            alt={movie.name}
            className="w-40 md:w-60 rounded-lg shadow-lg mt-16"
          />

          {/* Movie Info */}
          <div className="flex-1 mt-10 md:mt-16 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold">{movie.name}</h1>
            <h2 className="text-md md:text-xl text-gray-400 italic">
              {movie.original_name}
            </h2>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
              <span className="text-gray-400 text-sm">
                {new Date(movie.created).getFullYear()}
              </span>
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                {movie.quality}
              </span>
              <span className="text-gray-400 text-sm">
                {movie.total_episodes} Tập
              </span>
              <span className="text-gray-400 text-sm">{movie.time}</span>
            </div>

            {/* Mô tả chi tiết */}
            <div
              className="mt-4 text-gray-300 text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: movie.description }}
            ></div>

            {/* Thông tin khác */}
            <div className="mt-4 text-sm md:text-base">
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
          </div>
        </div>

        {/* Episodes - Hiển thị theo từng server */}
        <div className="relative z-10 mt-6 px-5 md:px-10">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left">
            Danh sách tập
          </h2>
          {episodeList}
        </div>
      </div>
    </>
  );
};

export default MoviePage;
