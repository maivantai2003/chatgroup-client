import { useDispatch, useSelector } from "react-redux";
import "./App.css";
//import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import ListGroup from "./pages/ListGroup";
import LoginForm from "./pages/Login";
import TitleBar from "./pages/TitleBar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Sidebar from "./pages/Siderbar";
import FriendSuggestions from "./pages/friends";
import FriendList from "./pages/FriendList";
import GroupList from "./pages/GroupList";
import { jwtDecode } from "jwt-decode";
import ImageSlider from "./components/ImageSlider";
import { FaRemoveFormat, FaSearch } from "react-icons/fa";
function App() {
  //const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
      <Routes>
      {/* {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<MainLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )} */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
const MainLayout = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("message");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  if (token !== null) {
    var user = jwtDecode(token).userInfor;
    localStorage.setItem("user", user);
    var userInfor = JSON.parse(localStorage.getItem("user"));
    var userId = userInfor.UserId;
    var avatar = userInfor.Avatar;
    var userName = userInfor.UserName;
  } else {
    navigate("/login");
  }
  return (
    //<SignalRProvider>
    <div className="bg-gray-100 flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex h-screen w-full">
        {activeTab === "requests" ? (
          <FriendSuggestions id={userId} />
        ) : activeTab === "friends" ? (
          <FriendList id={userId} />
        ) : activeTab === "groups" ? (
          <GroupList id={userId} />
        ) : (
          <>
            <div className="w-1/4 bg-white text-black flex flex-col">
              <TitleBar name={userName} id={userId} avatar={avatar} />
              <div className="p-4">
                <div className="flex items-center w-full h-8 px-3 rounded-lg bg-gray-100 text-gray-600">
                  <FaSearch className="w-4 h-4" />
                  <input
                    className="w-full bg-transparent outline-none text-black ml-2 text-sm"
                    placeholder="Tìm kiếm"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="ml-2 text-gray-500 hover:text-black"
                    >
                      x
                    </button>
                  )}
                </div>
              </div>
              {/* {search ? <ListGroup /> : <input />} */}
              <ListGroup
                id={userId}
                onSelectConversation={setSelectedConversation}
              />
            </div>
            {selectedConversation ? (
              <>
                <ChatMessage conversation={selectedConversation} />
                <InforChat conversation={selectedConversation} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                {/* <ImageSlider/> */}
                <p className="text-lg text-gray-500">
                  Chọn một cuộc trò chuyện để bắt đầu
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    //</SignalRProvider>
  );
};
export default App;
