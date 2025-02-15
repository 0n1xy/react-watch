// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
// import { useRef } from "react";
// import { Swiper as SwiperType } from "swiper";
// import MovieCard from "./MovieCard_Component";

// const VerticalMovieCarousel = ({ movies }: { movies: any[] }) => {
//   const swiperRef = useRef<SwiperType | null>(null);

//   if (!movies || movies.length === 0) return null;

//   return (
//     <div className="relative w-full h-[500px]">
//       {/* Nút điều hướng lên */}
//       <button
//         className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-black/40 p-2 rounded-full text-white hover:bg-black transition"
//         onClick={() => swiperRef.current?.slidePrev()}
//       >
//         <FiChevronUp size={20} />
//       </button>

//       {/* Swiper dọc */}
//       <Swiper
//         direction="vertical"
//         modules={[Navigation]}
//         slidesPerView={4}
//         spaceBetween={15}
//         loop={movies.length > 4}
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         className="h-full overflow-hidden"
//       >
//         {movies.map((movie) => (
//           <SwiperSlide key={movie.slug} style={{ height: "120px" }}>
//             <MovieCard movie={movie} />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Nút điều hướng xuống */}
//       <button
//         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 bg-black/40 p-2 rounded-full text-white hover:bg-black transition"
//         onClick={() => swiperRef.current?.slideNext()}
//       >
//         <FiChevronDown size={20} />
//       </button>
//     </div>
//   );
// };

// export default VerticalMovieCarousel;

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { FaPlay } from "react-icons/fa";

const VerticalMovieCarousel = ({ movies }: { movies: any[] }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full h-screen">
      {/* <button
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black transition"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <FiChevronUp size={20} />
      </button> */}

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
            <div className="relative group cursor-pointer">
              {/* Ảnh phim */}
              <img
                src={movie.poster_url}
                alt={movie.name}
                className="w-full h-[280px] object-cover rounded-lg"
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

      {/* Nút điều hướng xuống */}
      <button
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black transition"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <FiChevronDown size={20} />
      </button>
    </div>
  );
};

export default VerticalMovieCarousel;
