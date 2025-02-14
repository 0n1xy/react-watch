import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { IMovie } from "../types/Movie_Type";

// Định nghĩa kiểu dữ liệu phim

const UPDATE_MOVIE_API_URL = import.meta.env.VITE_UPDATE_MOVIE_API_URL;

function MovieSlide() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [activeSlide, setActiveSlide] = useState<number>(0); // Theo dõi slide hiện tại

  useEffect(() => {
    axios
      .get(UPDATE_MOVIE_API_URL)
      .then((response) => {
        setMovies(response.data.items.slice(0, 5)); // Lấy 5 phim mới nhất
      })
      .catch((error) => console.error("Lỗi tải slide:", error));
  }, []);

  return (
    <div className="w-full h-[800px] relative overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        watchSlidesProgress={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)} // Cập nhật slide
        className="w-screen max-w-full h-full"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.slug} className="relative">
            {/* Background chỉ hiển thị nếu là slide hiện tại */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${movie.poster_url})` }}
            ></div>

            {/* Overlay để làm tối background */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Nội dung phim */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center px-10 md:px-20">
              <div className="max-w-xl z-10">
                <h2 className="text-4xl font-bold text-white">{movie.name}</h2>
                <p className="text-gray-300 text-lg mt-3">
                  {movie.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded">
                    {movie.quality}
                  </span>
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                    {movie.language}
                  </span>
                </div>
                <a
                  href={`/movie/${movie.slug}`}
                  className="mt-5 inline-block px-6 py-2 bg-yellow-500 text-black font-semibold text-lg rounded hover:bg-yellow-600 transition"
                >
                  Xem ngay
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MovieSlide;
