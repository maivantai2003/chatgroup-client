import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetNewPapers } from "../redux/newPaper/newPaperSlice";
import { Spinner } from "../components/Spinner";

export const NewParers = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const listNewPaper = useSelector((state) => state.newpaper.listNewPaper);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        if (listNewPaper && listNewPaper.length > 0) {
          setNews(listNewPaper);
          setFilteredNews(listNewPaper);
        } else {
          const result = await dispatch(GetNewPapers()).unwrap();
          setNews(result);
          setFilteredNews(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [listNewPaper, dispatch]);
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNews(news);
    } else {
      const keyword = search.toLowerCase();
      setFilteredNews(
        news.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        )
      );
    }
  }, [search, news]);

  if (loading) return <Spinner/>;
  if (error) return <p className="p-4 text-red-500">Lỗi: {error}</p>;

  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 px-4 font-semibold shadow-md">
        <marquee behavior="scroll" direction="left" scrollamount="5">
          🔥 Tin nóng: {news[0]?.title}
        </marquee>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">📰 Tin tức mới nhất</h2>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm kiếm tin tức..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {filteredNews.length === 0 ? (
          <p className="text-gray-500">Không tìm thấy tin tức nào.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition p-4 flex flex-col"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">
                  {item.description}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(item.published).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
