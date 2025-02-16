import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const VerticalMovieCarousel = ({ movies }: { movies: any[] }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate(); // ✅ Hook để chuyển trang

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full h-screen ">
      <Swiper
        direction="vertical"
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={15}
        loop={movies.length > 3}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-full overflow-hidden"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.slug} style={{ height: "280px" }}>
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate(`/movie/${movie.slug}`)} // ✅ Điều hướng khi click
            >
              {/* Ảnh phim */}
              <img
                src={movie.poster_url}
                alt={movie.name}
                className="w-full h-[280px] object-cover rounded-lg sm:h-[230px]"
              />

              {/* Overlay tối + Nút Play */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300 rounded-lg flex items-center justify-center">
                <FaPlay
                  className="text-white opacity-0 group-hover:opacity-100 transition duration-300"
                  size={30}
                />
              </div>

              {/* Thông tin phim */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent text-white rounded-b-lg">
                <h3 className="text-lg font-semibold">{movie.name}</h3>
                <p className="text-xs text-gray-300">
                  {movie.time || "N/A"} min
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VerticalMovieCarousel;
