import { useRef } from "react";
import { Swiper as SwiperType } from "swiper"; // 🛠 Import kiểu Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard_Component";

const MovieCarousel = ({ movies, title }: { movies: any[]; title: string }) => {
  const swiperRef = useRef<SwiperType | null>(null); // 🛠 Định nghĩa kiểu dữ liệu cho useRef

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-screen px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h2 className="text-white text-xl font-bold">{title}</h2>
        </div>
        <a
          href="#"
          className="text-gray-400 text-sm hover:text-white transition"
        >
          See all
        </a>
      </div>

      {/* Swiper Wrapper */}
      <div className="relative w-full px-8">
        {/* Nút điều hướng trái */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 p-2 rounded-full text-white hover:bg-black transition"
          onClick={() => swiperRef.current?.slidePrev()} // 🛠 Fix lỗi
        >
          <FiChevronLeft size={20} />
        </button>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={15}
          loop={movies.length > 5}
          onSwiper={(swiper) => (swiperRef.current = swiper)} // 🛠 Lưu Swiper instance vào ref
          className="overflow-hidden"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.slug} style={{ width: "330px" }}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng phải */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 p-2 rounded-full text-white hover:bg-black transition"
          onClick={() => swiperRef.current?.slideNext()} // 🛠 Fix lỗi
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;
