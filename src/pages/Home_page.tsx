import { useEffect, useState } from "react";
import axios from "axios";
import MovieCarousel from "../components/MovieCarousel_Component";
import NavComponent from "../components/Nav_component";
import MovieSlide from "../components/MovieSlide_Component";

const CATEGORY_MOVIE_API_URL = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;

const categories = [
  { name: "Phim Hành Động", slug: "hanh-dong" },
  { name: "Phim Hàn Quốc", slug: "han-quoc" },
  { name: "Phim Hình Sự", slug: "hinh-su" },
  { name: "Phim Kinh Dị", slug: "kinh-di" },
];

function HomePage() {
  const [categoryMovies, setCategoryMovies] = useState<Record<string, any[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-black min-h-screen text-white">
      <NavComponent />
      {loading ? (
        <div className="text-center text-gray-400 py-10">Đang tải phim...</div>
      ) : (
        <>
          <MovieSlide />
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
