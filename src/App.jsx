import { useDispatch, useSelector } from "react-redux";
import "./App.css";
//import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import ListGroup from "./pages/ListGroup";
import LoginForm from "./pages/Login";
import TitleBar from "./pages/TitleBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Sidebar from "./pages/Siderbar";
import FriendSuggestions from "./pages/friends";
import FriendList from "./pages/FriendList";
import GroupList from "./pages/GroupList";
import { jwtDecode } from "jwt-decode";
import { GetAllConversation } from "./redux/conversation/conversationSlice";
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
  const [search,setSearch]=useState("")
  const [activeTab, setActiveTab] = useState("message");
  const token = localStorage.getItem("accessToken");
  if (token) {
    var user=jwtDecode(token).userInfor
    localStorage.setItem("user",user)
    var userInfor=JSON.parse(localStorage.getItem("user"))
    var userId = userInfor.UserId
    var avatar = userInfor.Avatar
    var userName=userInfor.UserName
  }
  return (
    <div className="bg-gray-100 flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex h-screen w-full">
        {activeTab === "requests" ? (
          <FriendSuggestions id={userId} />
        ) : activeTab === "friends" ? (
          <FriendList id={userId} />
        ) :activeTab === "groups" ? (
          <GroupList id={userId} />
        ) : (
          <>
            <div className="w-1/4 bg-blue-600 text-black flex flex-col">
              <TitleBar name={userName} id={userId} avatar={avatar} />
              <div className="p-4">
                <input
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              {/* {search ? <ListGroup /> : <input />} */}
              <ListGroup id={userId} />
            </div>
            <ChatMessage />
            <InforChat />
          </>
        )}
      </div>
    </div>
  );
};
export default App;
