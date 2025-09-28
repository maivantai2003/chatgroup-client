import "./App.css";
//import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import LoginForm from "./pages/Login";
import TitleBar from "./pages/TitleBar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Sidebar from "./pages/Siderbar";
import FriendSuggestions from "./pages/friends";
import FriendList from "./pages/FriendList";
import GroupList from "./pages/GroupList";
import ImageSlider from "./components/ImageSlider";
import ListConversation from "./pages/ListConversation";
import ChatWidgetWrapper from "./components/ChatWidgetWrapper";
import { ForgotPassword } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { isTokenExpired } from "./utils/helpers";
import { NewParers } from "./pages/NewPapers";
function App() {
  //const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPasswordPage/>}/>
    </Routes>
  );
}
const MainLayout = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("message");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showInfor, setShowInfor] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);
  
  
  if (!token || isTokenExpired(token)) {
    return null;
  }
  var userInfor = JSON.parse(localStorage.getItem("user"));
  var userId = userInfor.UserId;
  var avatar = userInfor.Avatar;
  var userName = userInfor.UserName;
  return (
    <>
    <div className="bg-gray-100 flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex h-full">
        {activeTab === "requests" ? (
          <FriendSuggestions id={userId} />
        ) : activeTab === "friends" ? (
          <FriendList id={userId} />
        ) : activeTab === "groups" ? (
          <GroupList id={userId} />
        ): activeTab === "news" ? (
          <NewParers/>
        ) : (
          <>
            <div className="w-1/4 bg-white text-black flex flex-col border-r border-gray-200">
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
              <ListConversation
                id={userId}
                onSelectConversation={setSelectedConversation}
                search={search}
              />
            </div>
            {selectedConversation ? (
              <>
                <ChatMessage conversation={selectedConversation} onToggleInfor={() => setShowInfor(prev => !prev)} />
                {
                  showInfor && (<InforChat conversation={selectedConversation} />)
                }
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <ImageSlider/>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <ChatWidgetWrapper />
    </>
  );
};
export default App;
