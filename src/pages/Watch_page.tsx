import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavComponent from "../components/Nav_component";
import VerticalMovieCarousel from "../components/VerticalMovieCarousel_Component";
import { ICategory, IEpisodeItem, IMovie, IServer } from "../types/Movie_Type";

// ✅ Chuyển tên thể loại thành slug an toàn
const convertToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const WatchPage = () => {
  const { slug, episodeSlug } = useParams();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<IEpisodeItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentServer, setCurrentServer] = useState<string>("");
  const [relatedMovies, setRelatedMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(""); // Reset lỗi trước khi gọi API

        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
        const apiUrl = `${baseUrl}/${slug}`;

        const response = await axios.get(apiUrl);
        const movieData = response.data.movie;
        setMovie(movieData);

        // ✅ Tìm tập phim đang xem
        const selectedEpisode = movieData.episodes
          .flatMap((server: IServer) => server.items)
          .find((ep: IEpisodeItem) => ep.slug === episodeSlug);

        setCurrentEpisode(selectedEpisode || null);
        setCurrentServer(
          movieData.episodes.find((server: IServer) =>
            server.items.some((ep: IEpisodeItem) => ep.slug === episodeSlug)
          )?.server_name || ""
        );

        // ✅ Lấy danh sách thể loại của phim
        const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
        const categories = movieData.category["2"].list;

        const categorySlugs = categories.map((category: ICategory) =>
          convertToSlug(category.name)
        );

        // ✅ Gọi API lấy phim theo từng thể loại và trộn dữ liệu
        const moviePromises = categorySlugs.map(
          async (categorySlug: string) => {
            try {
              const res = await axios.get(
                `${categoryUrl}${categorySlug}?page=1`
              );
              return res.data.items || [];
            } catch (error) {
              console.error(
                `Lỗi fetch dữ liệu cho thể loại ${categorySlug}:`,
                error
              );
              return [];
            }
          }
        );

        const categoryMovies = await Promise.all(moviePromises);
        setRelatedMovies(categoryMovies.flat());
      } catch (err) {
        console.error("Không thể tải thông tin phim.");
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (slug && episodeSlug) fetchMovie();
  }, [slug, episodeSlug]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-white text-xl animate-pulse">🎬 Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!movie || !currentEpisode) {
    return (
      <p className="text-center text-white mt-10">Không có dữ liệu phim.</p>
    );
  }

  return (
    <>
      <NavComponent />
      <div className="bg-gray-900 min-h-screen text-white flex flex-col md:flex-row overflow-y-hidden">
        {/* Cột trái: Video Player + Danh sách tập */}
        <div className="w-full md:w-2/3 p-4 md:p-5">
          {/* 🎬 Video Player (Full Width trên Mobile) */}
          <div className="w-full h-[250px] md:h-[700px] rounded-lg overflow-hidden shadow-lg mt-4 md:mt-16">
            <iframe
              src={currentEpisode.embed}
              className="w-full h-full border-none"
              allowFullScreen
            ></iframe>
          </div>

          {/* 📝 Danh sách tập - Scroll ngang trên Mobile */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Danh sách tập</h3>
            {movie.episodes?.map((server: IServer, serverIndex: number) => (
              <div key={serverIndex} className="mt-3">
                <h4 className="text-md font-semibold">{server.server_name}</h4>
                <div className="flex overflow-x-auto gap-2 mt-2 p-2">
                  {server.items.map((ep: IEpisodeItem) => (
                    <button
                      key={ep.slug}
                      onClick={() => {
                        setCurrentEpisode(ep);
                        setCurrentServer(server.server_name);
                      }}
                      className={`px-3 py-2 text-sm font-bold rounded text-center ${
                        ep.slug === currentEpisode.slug &&
                        server.server_name === currentServer
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {`Tập ${ep.name}`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📺 Cột phải: Phim cùng thể loại (Ẩn trên mobile) */}
        <div className="hidden md:block w-1/3 p-5 border-l border-gray-700 mt-16">
          <h2 className="text-xl font-bold mb-4">Phim cùng thể loại</h2>
          <VerticalMovieCarousel movies={relatedMovies} />
        </div>

        {/* 📺 Phim cùng thể loại - Hiển thị trên mobile */}
        <div className="block md:hidden p-4">
          <h2 className="text-lg font-bold mb-3 text-center">
            🎥 Phim cùng thể loại
          </h2>
          <VerticalMovieCarousel movies={relatedMovies} />
        </div>
      </div>
    </>
  );
};

export default WatchPage;
