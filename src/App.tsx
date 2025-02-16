import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "./pages/Home_page";
const MoviePage = lazy(() => import("./pages/Movie_page"));
const WatchPage = lazy(() => import("./pages/Watch_page"));
const SearchPage = lazy(() => import("./pages/SearchResult_page"));
function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="text-white text-center mt-10">Đang tải...</div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:slug" element={<MoviePage />} />
          <Route path="/watch/:slug/:episodeSlug" element={<WatchPage />} />
          <Route path="/search/:slug" element={<SearchPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
