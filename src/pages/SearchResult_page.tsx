// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import MovieCard from "../components/MovieCard_Component";
// import NavComponent from "../components/Nav_component";

// // Lấy URL API từ env
// const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL;

// const SearchResult = () => {
//   const { slug } = useParams(); // Nhận slug từ URL
//   const [movies, setMovies] = useState<any[]>([]); // ✅ Fix: Dữ liệu là mảng
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // ✅ Fetch dữ liệu từ API
//         const response = await axios.get(`${SEARCH_API_URL}${slug}`);
//         console.log("📌 API Response:", response.data); // ✅ Debug dữ liệu

//         // ✅ Lấy dữ liệu từ `items`
//         setMovies(response.data.items || []);
//       } catch (error) {
//         console.error("❌ API Error:", error);
//         setError("Không thể tải thông tin phim.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) fetchMovies();
//   }, [slug]);

//   if (loading)
//     return (
//       <div className="text-white text-center mt-10">🔍 Đang tìm kiếm...</div>
//     );

//   if (error)
//     return <div className="text-red-500 text-center mt-10">{error}</div>;

//   return (
//     <>
//       <NavComponent />

//       <div className="min-h-screen bg-black text-white p-10 ">
//         <h2 className="text-2xl font-bold mb-6 mt-16">
//           🎬 Kết quả tìm kiếm cho: "<span className="text-red-500">{slug}</span>
//           "
//         </h2>

//         {/* Kiểm tra nếu không có phim */}
//         {movies.length === 0 ? (
//           <p className="text-gray-400">⚠ Không tìm thấy phim nào.</p>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {movies.map((movie) => (
//               <MovieCard key={movie.slug} movie={movie} />
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SearchResult;

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard_Component";
import NavComponent from "../components/Nav_component";

// Lấy URL API từ env
const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL;

const SearchResult = () => {
  const { slug } = useParams(); // Nhận slug từ URL
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Tạo hàm fetchMovies tối ưu với useCallback
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${SEARCH_API_URL}${slug}`);

      setMovies(response.data.items || []);
    } catch (error) {
      console.error("❌ API Error:", error);
      setError("Không thể tải thông tin phim.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchMovies();
  }, [slug, fetchMovies]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">
          🔍 Đang tìm kiếm...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <>
      <NavComponent />

      <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10 overflow-hidden">
        <h2 className="text-lg md:text-2xl font-bold mb-6 mt-16">
          🎬 Kết quả tìm kiếm cho:{" "}
          <span className="text-red-500">"{slug}"</span>
        </h2>

        {/* Hiển thị nếu không có phim */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-400 text-center">
              ⚠ Không tìm thấy phim nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResult;
