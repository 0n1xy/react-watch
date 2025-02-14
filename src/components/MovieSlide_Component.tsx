import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

const API_URL = "https://phim.nguonc.com/api/films/phim-moi-cap-nhat";

const MovieSlide = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // Use React Router for navigation

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setMovies(response.data.items.slice(0, 5)))
      .catch((error) => console.error("Error fetching slides:", error));
  }, []);

  return (
    <div className="w-full h-[500px] relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.slug}>
            <div
              className="absolute inset-0 bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${movie.poster_url})` }}
              onClick={() => navigate(`/movie/${movie.slug}`)} // Fix navigation here
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Movie Info */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center px-10 md:px-20">
                <div className="max-w-xl z-10 text-white">
                  <h2 className="text-4xl font-bold">{movie.name}</h2>
                  <p className="text-gray-300 text-lg mt-3">
                    {movie.description}
                  </p>
                  <button
                    onClick={() => navigate(`/movie/${movie.slug}`)}
                    className="mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold text-lg rounded hover:bg-yellow-600 transition"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlide;
