import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavComponent from "../components/Nav_component";
import VerticalMovieCarousel from "../components/VerticalMovieCarousel_Component";
import { ICategory, IEpisodeItem, IMovie, IServer } from "../types/Movie_Type";

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
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<IEpisodeItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentServer, setCurrentServer] = useState<string>("");
  const [relatedMovies, setRelatedMovies] = useState<IMovie[]>([]);
  const [isChangingEpisode, setIsChangingEpisode] = useState(false); // ✅ Trạng thái thay đổi tập

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
        const apiUrl = `${baseUrl}/${slug}`;

        const response = await axios.get(apiUrl);
        const movieData = response.data.movie;
        setMovie(movieData);

        // ✅ Chỉ set `currentEpisode` nếu `episodeSlug` tồn tại
        const selectedEpisode = movieData.episodes
          .flatMap((server: IServer) => server.items)
          .find((ep: IEpisodeItem) => ep.slug === episodeSlug);

        setCurrentEpisode(selectedEpisode || null);
        setCurrentServer(
          movieData.episodes.find((server: IServer) =>
            server.items.some((ep: IEpisodeItem) => ep.slug === episodeSlug)
          )?.server_name || ""
        );

        // ✅ Lấy danh sách phim liên quan
        const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
        const categories = movieData.category["2"].list;

        const categorySlugs = categories.map((category: ICategory) =>
          convertToSlug(category.name)
        );

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
        const uniqueMovies = Array.from(
          new Map(
            categoryMovies.flat().map((item) => [item.slug, item])
          ).values()
        );

        setRelatedMovies(uniqueMovies);
      } catch (err) {
        console.error("Không thể tải thông tin phim.");
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMovie();
  }, [slug]);

  // ✅ Chuyển đổi tập phim mà không gây loading lại toàn trang
  const handleEpisodeChange = (ep: IEpisodeItem, serverName: string) => {
    setIsChangingEpisode(true);
    setTimeout(() => {
      setCurrentEpisode(ep);
      setCurrentServer(serverName);
      setIsChangingEpisode(false);
      navigate(`/watch/${slug}/${ep.slug}`);
      handleWatchedMovie();
    }, 300); // ✅ Hiệu ứng chuyển đổi nhẹ
  };

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

  const handleWatchedMovie = () => {
    if (!movie || !currentEpisode) {
      return;
    }

    // Lấy danh sách phim đã xem từ localStorage
    const watchedMovies = JSON.parse(
      localStorage.getItem("watchedMovies") || "[]"
    );

    // Kiểm tra xem phim đã có trong danh sách chưa
    const isMovieWatched = watchedMovies.some(
      (m: { id: string; episodeSlug: string }) =>
        m.id === movie.id && m.episodeSlug === currentEpisode.slug
    );

    if (!isMovieWatched) {
      // Thêm phim vào danh sách đã xem
      const updatedMovies = [
        ...watchedMovies,
        {
          id: movie.id,
          name: movie.name,
          episodeSlug: currentEpisode.slug,
        },
      ];
      localStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));
    }
  };

  return (
    <>
      <NavComponent />
      <div className="bg-gray-900 min-h-screen text-white flex flex-col md:flex-row overflow-y-hidden">
        {/* Cột trái: Video Player + Danh sách tập */}
        <div className="w-full md:w-2/3 p-4 md:p-5">
          {/* 🎬 Video Player */}
          <div className="w-full h-[250px] md:h-[700px] rounded-lg overflow-hidden shadow-lg mt-4 md:mt-16">
            {isChangingEpisode ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-white text-lg animate-pulse">
                  ⏳ Đang tải tập mới...
                </div>
              </div>
            ) : (
              <iframe
                src={currentEpisode.embed}
                className="w-full h-full border-none"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* 📝 Danh sách tập */}
          <div className="mt-6">
            <div className="flex flex-row justify-between">
              <h3 className=" text-lg font-bold mb-3">Danh sách tập</h3>
            </div>

            {movie.episodes?.map((server: IServer, serverIndex: number) => (
              <div key={serverIndex} className="mt-3">
                <h4 className="text-md font-semibold">{server.server_name}</h4>

                {/* ✅ Mobile: Cuộn ngang | Desktop: Hiển thị toàn bộ */}
                <div className="flex flex-wrap md:grid md:grid-cols-8 gap-2 mt-2 p-2">
                  {server.items.map((ep: IEpisodeItem) => {
                    const isWatched = JSON.parse(
                      localStorage.getItem("watchedMovies") || "[]"
                    ).some(
                      (m: { id: string; episodeSlug: string }) =>
                        m.id === movie.id && m.episodeSlug === ep.slug
                    );

                    return (
                      <button
                        key={ep.slug}
                        onClick={() =>
                          handleEpisodeChange(ep, server.server_name)
                        }
                        className={`px-3 py-2 text-sm md:text-base font-bold rounded text-center transition ${
                          ep.slug === currentEpisode.slug &&
                          server.server_name === currentServer
                            ? "bg-red-600 text-white"
                            : isWatched
                            ? "bg-green-500 text-white" // ✅ Nếu đã xem, đổi màu xanh
                            : "bg-gray-700 hover:bg-gray-800 text-white"
                        }`}
                      >
                        {`Tập ${ep.name}`} {isWatched && "✔️"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📺 Phim cùng thể loại */}
        <div className="hidden md:block w-1/3 p-5 border-l border-gray-700 mt-16">
          <h2 className="text-xl font-bold mb-4">Phim cùng thể loại</h2>
          <VerticalMovieCarousel movies={relatedMovies} />
        </div>
      </div>
    </>
  );
};

export default WatchPage;
