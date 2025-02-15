// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import NavComponent from "../components/Nav_component";
// import VerticalMovieCarousel from "../components/VerticalMovieCarousel_Component";

// const WatchPage = () => {
//   const { slug, episodeSlug } = useParams(); // Lấy slug phim và tập từ URL
//   const [movie, setMovie] = useState(null);
//   const [currentEpisode, setCurrentEpisode] = useState(null);
//   const [relatedMovies, setRelatedMovies] = useState([]); // Phim cùng thể loại

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

//         const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
//         const categories = response.data.movie.category["2"].list;
//         console.log(categories);

//         // Lấy dữ liệu từ nhiều thể loại và trộn chúng lại
//         const moviePromises = categories.map(async (category) => {
//           try {
//             const res = await axios.get(
//               `${categoryUrl}${category.name}?page=1`
//             );
//             console.log(res);
//             return res.data.items || [];
//           } catch (error) {
//             console.error(`Lỗi fetch dữ liệu cho ${category.name}:`, error);
//             return [];
//           }
//         });

//         const categoryMovies = await Promise.all(moviePromises);
//         setRelatedMovies(categoryMovies.flat()); // Trộn tất cả phim lại
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
//         <div className="w-2/3 p-5">
//           {/* Video Player */}
//           {/* <div className="w-full h-[700px] mt-16">
//             <iframe
//               src={currentEpisode.embed}
//               className="w-full h-full border-none rounded-lg"
//               allowFullScreen
//             ></iframe>
//           </div> */}

//           <div className="mt-4">
//             <h3 className="text-lg font-bold">Danh sách tập</h3>
//             {movie.episodes?.map((server, serverIndex) => (
//               <div key={serverIndex} className="mt-3">
//                 <h4 className="text-md font-semibold">{server.server_name}</h4>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {server.items.map((ep) => (
//                     <button
//                       key={ep.slug}
//                       onClick={() => setCurrentEpisode(ep)}
//                       className={`px-4 py-2 font-bold rounded text-center ${
//                         ep.slug === currentEpisode.slug
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

const convertToSlug = (str) => {
  return str
    .toLowerCase() // Chuyển thành chữ thường
    .normalize("NFD") // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/[đ]/g, "d") // Chuyển đ -> d
    .replace(/[^a-z0-9]+/g, "-") // Thay dấu cách, ký tự đặc biệt bằng -
    .replace(/^-+|-+$/g, ""); // Xóa dấu - thừa ở đầu/cuối
};

const WatchPage = () => {
  const { slug, episodeSlug } = useParams(); // Lấy slug phim và tập từ URL
  const [movie, setMovie] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]); // Phim cùng thể loại

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const baseUrl = import.meta.env.VITE_MOVIE_DETAIL_API_URL;
        const apiUrl = `${baseUrl}/${slug}`;

        const response = await axios.get(apiUrl);
        setMovie(response.data.movie);

        const selectedEpisode = response.data.movie.episodes
          .flatMap((server) => server.items)
          .find((ep) => ep.slug === episodeSlug);

        setCurrentEpisode(selectedEpisode || null);

        // Lấy danh sách thể loại của phim
        const categoryUrl = import.meta.env.VITE_CATEGORY_MOVIE_API_URL;
        const categories = response.data.movie.category["2"].list;
        console.log("Danh sách thể loại:", categories);

        // Chuyển tên thể loại thành slug
        const categorySlugs = categories.map((category) =>
          convertToSlug(category.name)
        );
        console.log("Danh sách slug thể loại:", categorySlugs);

        // Fetch danh sách phim từ API theo từng thể loại
        const moviePromises = categorySlugs.map(async (categorySlug) => {
          try {
            const res = await axios.get(`${categoryUrl}${categorySlug}?page=1`);
            return res.data.items || [];
          } catch (error) {
            console.error(
              `Lỗi fetch dữ liệu cho thể loại ${categorySlug}:`,
              error
            );
            return [];
          }
        });

        const categoryMovies = await Promise.all(moviePromises);
        setRelatedMovies(categoryMovies.flat()); // Trộn tất cả phim lại
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

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Danh sách tập</h3>
            {movie.episodes?.map((server, serverIndex) => (
              <div key={serverIndex} className="mt-3">
                <h4 className="text-md font-semibold">{server.server_name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {server.items.map((ep) => (
                    <button
                      key={ep.slug}
                      onClick={() => setCurrentEpisode(ep)}
                      className={`px-4 py-2 font-bold rounded text-center ${
                        ep.slug === currentEpisode.slug
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
