import { useState } from "react";
import { FiSearch, FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import debounce from "lodash.debounce";

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL;

function NavComponent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Gọi API tìm kiếm với debounce
  const fetchMovies = debounce(async (query: string) => {
    if (!query) return setResults([]);
    try {
      const response = await axios.get(`${SEARCH_API_URL}${query}`);
      setResults(response.data.items || []);
    } catch (error) {
      console.error("Lỗi fetch API:", error);
    }
  }, 300);

  // Xử lý khi nhập vào input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchMovies(e.target.value);
  };

  // Đóng thanh tìm kiếm và danh sách gợi ý
  const closeSearch = () => {
    setIsSearchOpen(false);
    setResults([]); // Ẩn gợi ý khi đóng thanh search
  };

  // Xử lý khi click vào phim
  const handleMovieSelect = (slug: string) => {
    closeSearch();
    navigate(`/movie/${slug}`); // Điều hướng đến trang phim
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-50">
      {/* Logo + Menu */}
      <div className="flex items-center space-x-6 text-white font-semibold">
        <a href="#" className="text-xl font-bold">
          Logo
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Phim Lẻ
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Phim Bộ
        </a>
      </div>

      <div className="relative flex items-center space-x-4">
        <div className="relative flex items-center">
          {/* Thanh tìm kiếm */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute right-0 flex items-center bg-white rounded-md shadow-md overflow-hidden"
              >
                <button
                  onClick={closeSearch}
                  className="text-black text-xl px-3"
                >
                  <FiSearch />
                </button>
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="flex-1 px-3 py-2 outline-none text-black"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white text-xl px-2"
            >
              <FiSearch />
            </button>
          )}
        </div>

        {/* Icon thông báo */}
        <button className="text-white text-xl">
          <FiBell />
        </button>
      </div>

      {/* Danh sách kết quả tìm kiếm (hiển thị ngay dưới input) */}
      <AnimatePresence>
        {isSearchOpen && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[50px] right-14 w-[250px] bg-white shadow-lg rounded-md mt-2"
          >
            {results.map((movie: any) => (
              <li
                key={movie.slug}
                className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                onClick={() => handleMovieSelect(movie.slug)} // Chuyển hướng đến trang phim
              >
                {movie.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavComponent;
