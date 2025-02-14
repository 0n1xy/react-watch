import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard_Component";
import NavComponent from "../components/Nav_component";
import Pagination from "../components/Pagination_component";
import MovieSlide from "../components/MovieSlide_Component";

const UPDATE_MOVIE_API_URL = import.meta.env.VITE_UPDATE_MOVIE_API_URL;

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${UPDATE_MOVIE_API_URL}?page=${currentPage}`)
      .then((response) => {
        setMovies(response.data.items || []);
        setTotalPages(response.data.paginate.total_page);
      })
      .catch((error) => console.error("Lỗi fetch dữ liệu:", error))
      .finally(() => setLoading(false));
  }, [currentPage]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <NavComponent />
      {/* Slide phim mới cập nhật */}
      <MovieSlide />

      {/* Wrapper phim */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Phim Mới Cập Nhật 🎬
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <span className="text-lg font-semibold">Đang tải phim...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.slug}
                name={movie.name}
                original_name={movie.original_name}
                thumb_url={movie.thumb_url}
                slug={movie.slug}
                total_episodes={movie.total_episodes}
                description={movie.description}
                language={movie.language}
                quality={movie.quality}
                time={movie.time}
              />
            ))}
          </div>
        )}

        {/* Phân trang */}
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
