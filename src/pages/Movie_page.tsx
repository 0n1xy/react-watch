import { useParams } from "react-router-dom";

const WatchPage = () => {
  const { slug } = useParams(); // Lấy slug từ URL

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Thông tin phim: {slug}</h1>
    </div>
  );
};

export default WatchPage;
