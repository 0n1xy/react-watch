import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home_page";
import MoviePage from "./pages/Movie_page";
import WatchPage from "./pages/Watch_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:slug" element={<MoviePage />} />
        <Route path="/watch/:slug/:episodeSlug" element={<WatchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
