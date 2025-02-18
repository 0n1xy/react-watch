import { useEffect, useState } from "react";
import axios from "axios";
import MovieCarousel from "../components/MovieCarousel_Component";
import NavComponent from "../components/Nav_component";
import MovieSlide from "../components/MovieSlide_Component";

const CATEGORY_MOVIE_API_URL = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
const MOVIE_DETAIL_API_URL = import.meta.env.VITE_MOVIE_DETAIL_API_URL;

const convertToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/[đ]/g, "d") // Chuyển đ -> d
    .replace(/[^a-z0-9]+/g, "-") // Thay khoảng trắng, ký tự đặc biệt bằng dấu -
    .replace(/^-+|-+$/g, ""); // Xóa dấu - ở đầu hoặc cuối
};

const categories = [
  { name: "Phim Hành Động", slug: "hanh-dong" },
  { name: "Phim Bộ", slug: "phim-bo" },
  { name: "Phim Lẻ", slug: "phim-le" },
  { name: "Phim Hàn", slug: "han-quoc" },
  { name: "Phim Trung", slug: "trung-quoc" },
  { name: "Phim Việt Nam", slug: "viet-nam" },
  { name: "Phim Tình Cảm", slug: "tinh-cam" },
  { name: "Phim Kinh Dị", slug: "kinh-di" },
];

function HomePage() {
  const [categoryMovies, setCategoryMovies] = useState<Record<string, any[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const response = await axios.get(
              `${CATEGORY_MOVIE_API_URL}${category.slug}?page=1`
            );
            return { [category.slug]: response.data.items || [] };
          })
        );

        setCategoryMovies(Object.assign({}, ...results));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    document.title = "Watch Movie";
  }, []);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      const storedMovies = JSON.parse(
        localStorage.getItem("watchedMovies") || "[]"
      );

      if (storedMovies.length === 0) {
        setSavedMovies([]);
        return;
      }

      try {
        // 🔥 Loại bỏ phim trùng lặp bằng cách dùng `Map`
        const uniqueMovies = Array.from(
          new Map(storedMovies.map((m) => [m.name, m])).values()
        );

        const movieDetails = await Promise.all(
          uniqueMovies.map(async (movie: { name: string }) => {
            try {
              const slug = convertToSlug(movie.name);
              const response = await axios.get(
                `${MOVIE_DETAIL_API_URL}/${slug}`
              );
              return response.data.movie;
            } catch (error) {
              console.error(
                `Lỗi khi tải dữ liệu phim ID: ${movie.name}`,
                error
              );
              return null;
            }
          })
        );

        // 🔥 Chỉ lưu phim hợp lệ (không null) & không trùng lặp
        const filteredMovies = Array.from(
          new Map(movieDetails.filter(Boolean).map((m) => [m.id, m])).values()
        );

        setSavedMovies(filteredMovies);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim đã lưu:", error);
      }
    };

    fetchSavedMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white overflow-auto">
      <NavComponent />
      {loading ? (
        <div className="text-center text-gray-400 py-10">Đang tải phim...</div>
      ) : (
        <>
          <MovieSlide />

          {savedMovies.length > 0 ? (
            <div className="px-4 py-6">
              <h2 className="text-xl font-bold mb-3">
                📌 Danh sách phim đã lưu
              </h2>
              <MovieCarousel title="Phim đã lưu" movies={savedMovies} />
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">
              Chưa có phim nào được lưu.
            </p>
          )}

          <div className="px-4 py-6">
            {categories.map((category) => (
              <MovieCarousel
                key={category.slug}
                title={category.name}
                movies={categoryMovies[category.slug] || []}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
