import { useParams } from "react-router-dom";

const WatchPage = () => {
  const { slug } = useParams(); // Get movie slug from URL

  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
      <h1 className="text-4xl">Now Watching: {slug}</h1>
      <p className="mt-4">This is where you can embed the movie player.</p>
    </div>
  );
};

export default WatchPage;
