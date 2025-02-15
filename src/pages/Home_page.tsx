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
];

function HomePage() {
  const [categoryMovies, setCategoryMovies] = useState<Record<string, never[]>>(
    {}
  );

  useEffect(() => {
    categories.forEach(async (category) => {
      try {
        const response = await axios.get(
          `${CATEGORY_MOVIE_API_URL}${category.slug}?page=1`
        );

        setCategoryMovies((prevMovies) => ({
          ...prevMovies,
          [category.slug]: response.data.items || [],
        }));
      } catch (error) {
        console.error(`Lỗi fetch dữ liệu cho ${category.name}:`, error);
      }
    });
  }, []);

  useEffect(() => {
    document.title = "Watch Movie";
  }, []);
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      <NavComponent />
      <MovieSlide />
      {/* Render từng danh mục phim */}
      <div className="w-screen px-0 py-6">
        {categories.map((category) => (
          <MovieCarousel
            key={category.slug}
            title={category.name}
            movies={categoryMovies[category.slug] || []}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
