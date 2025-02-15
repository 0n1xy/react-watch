// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import NavComponent from "../components/Nav_component";
// import VerticalMovieCarousel from "../components/VerticalMovieCarousel_Component";

// const convertToSlug = (str: string) => {
//   return str
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[đ]/g, "d")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };

// const WatchPage = () => {
//   const { slug, episodeSlug } = useParams();
//   const [movie, setMovie] = useState(null);
//   const [currentEpisode, setCurrentEpisode] = useState(null);
//   const [currentServer, setCurrentServer] = useState(""); // ✅ Lưu tên server hiện tại
//   const [relatedMovies, setRelatedMovies] = useState([]);

//   useEffect(() => {
//     const fetchMovie = async () => {
//       try {
//         const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
//         const apiUrl = `${baseUrl}/${slug}`;

//         const response = await axios.get(apiUrl);
//         setMovie(response.data.movie);

//         const selectedEpisode = response.data.movie.episodes
//           .flatMap((server) => server.items)
//           .find((ep) => ep.slug === episodeSlug);

//         setCurrentEpisode(selectedEpisode || null);
//         setCurrentServer(
//           response.data.movie.episodes.find((server) =>
//             server.items.some((ep) => ep.slug === episodeSlug)
//           )?.server_name || ""
//         ); // ✅ Lưu server của tập hiện tại

//         // Fetch danh sách phim cùng thể loại
//         const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
//         const categories = response.data.movie.category["2"].list;

//         const categorySlugs = categories.map((category) =>
//           convertToSlug(category.name)
//         );

//         const moviePromises = categorySlugs.map(async (categorySlug) => {
//           try {
//             const res = await axios.get(`${categoryUrl}${categorySlug}?page=1`);
//             return res.data.items || [];
//           } catch (error) {
//             console.error(
//               `Lỗi fetch dữ liệu cho thể loại ${categorySlug}:`,
//               error
//             );
//             return [];
//           }
//         });

//         const categoryMovies = await Promise.all(moviePromises);
//         setRelatedMovies(categoryMovies.flat());
//       } catch (err) {
//         console.error("Không thể tải thông tin phim.");
//       }
//     };

//     if (slug && episodeSlug) fetchMovie();
//   }, [slug, episodeSlug]);

//   if (!movie || !currentEpisode)
//     return <p className="text-center text-white mt-10">Đang tải...</p>;

//   return (
//     <>
//       <NavComponent />
//       <div className="bg-gray-900 min-h-screen text-white flex">
//         {/* Cột trái: Video Player + Danh sách tập */}
//         <div className="w-2/3 p-5">
//           {/* Video Player */}
//           <div className="w-full h-[700px] rounded-lg overflow-hidden shadow-lg mt-16">
//             <iframe
//               src={currentEpisode.embed}
//               className="w-full h-full border-none"
//               allowFullScreen
//             ></iframe>
//           </div>

//           {/* Danh sách tập */}
//           <div className="mt-6">
//             <h3 className="text-lg font-bold mb-3">Danh sách tập</h3>
//             {movie.episodes?.map((server, serverIndex) => (
//               <div key={serverIndex} className="mt-3">
//                 <h4 className="text-md font-semibold">{server.server_name}</h4>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {server.items.map((ep) => (
//                     <button
//                       key={ep.slug}
//                       onClick={() => {
//                         setCurrentEpisode(ep);
//                         setCurrentServer(server.server_name); // ✅ Cập nhật server hiện tại khi chọn tập
//                       }}
//                       className={`px-4 py-2 font-bold rounded text-center ${
//                         ep.slug === currentEpisode.slug &&
//                         server.server_name === currentServer // ✅ So sánh thêm server_name để tránh bị active sai
//                           ? "bg-red-600 text-white"
//                           : "bg-gray-700 hover:bg-gray-800 text-white"
//                       }`}
//                     >
//                       {`Tập ${ep.name}`}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Cột phải: Phim cùng thể loại */}
//         <div className="w-1/3 p-5 border-l border-gray-700 mt-16">
//           <h2 className="text-xl font-bold mb-4">Phim cùng thể loại</h2>
//           <VerticalMovieCarousel movies={relatedMovies} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default WatchPage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavComponent from "../components/Nav_component";
import VerticalMovieCarousel from "../components/VerticalMovieCarousel_Component";
import { ICategory, IEpisodeItem, IMovie, IServer } from "../types/Movie_Type";

// ✅ Định nghĩa kiểu dữ liệu cho phim
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
  const [currentServer, setCurrentServer] = useState<string>("");
  const [relatedMovies, setRelatedMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
        const apiUrl = `${baseUrl}/${slug}`;

        const response = await axios.get(apiUrl);
        setMovie(response.data.movie);

        const selectedEpisode = response.data.movie.episodes
          .flatMap((server: IServer) => server.items)
          .find((ep: IEpisodeItem) => ep.slug === episodeSlug);

        setCurrentEpisode(selectedEpisode || null);
        setCurrentServer(
          response.data.movie.episodes.find((server: IServer) =>
            server.items.some((ep: IEpisodeItem) => ep.slug === episodeSlug)
          )?.server_name || ""
        );

        // Fetch danh sách phim cùng thể loại
        const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
        const categories = response.data.movie.category["2"].list;

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
        setRelatedMovies(categoryMovies.flat());
      } catch (err) {
        console.error("Không thể tải thông tin phim.");
      }
    };

    if (slug && episodeSlug) fetchMovie();
  }, [slug, episodeSlug]);

  if (!movie || !currentEpisode)
    return <p className="text-center text-white mt-10">Đang tải...</p>;

  return (
    <>
      <NavComponent />
      <div className="bg-gray-900 min-h-screen text-white flex">
        {/* Cột trái: Video Player + Danh sách tập */}
        <div className="w-2/3 p-5">
          {/* Video Player */}
          <div className="w-full h-[700px] rounded-lg overflow-hidden shadow-lg mt-16">
            <iframe
              src={currentEpisode.embed}
              className="w-full h-full border-none"
              allowFullScreen
            ></iframe>
          </div>

          {/* Danh sách tập */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Danh sách tập</h3>
            {movie.episodes?.map((server: IServer, serverIndex: number) => (
              <div key={serverIndex} className="mt-3">
                <h4 className="text-md font-semibold">{server.server_name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {server.items.map((ep: IEpisodeItem) => (
                    <button
                      key={ep.slug}
                      onClick={() => {
                        setCurrentEpisode(ep);
                        setCurrentServer(server.server_name);
                      }}
                      className={`px-4 py-2 font-bold rounded text-center ${
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

        {/* Cột phải: Phim cùng thể loại */}
        <div className="w-1/3 p-5 border-l border-gray-700 mt-16">
          <h2 className="text-xl font-bold mb-4">Phim cùng thể loại</h2>
          <VerticalMovieCarousel movies={relatedMovies} />
        </div>
      </div>
    </>
  );
};

export default WatchPage;
