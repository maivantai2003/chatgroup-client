import { useSelector } from "react-redux";
import "./App.css";
//import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import ListGroup from "./pages/ListGroup";
import LoginForm from "./pages/Login";
import TitleBar from "./pages/TitleBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { useState } from "react";
import Sidebar from "./pages/Siderbar";
import FriendSuggestions from "./pages/friends";
import FriendList from "./pages/FriendList";
import GroupList from "./pages/GroupList";
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
  return (
    <div className="bg-gray-100 flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex h-screen w-full">
        {activeTab === "requests" ? (
          <FriendSuggestions />
        ) : activeTab === "friends" ? (
          <FriendList id={2} />
        ) :activeTab === "groups" ? (
          <GroupList />
        ) : (
          <>
            <div className="w-1/4 bg-blue-600 text-black flex flex-col">
              <TitleBar name={"Mai Văn Tài"} id={2} />
              <div className="p-4">
                <input
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              {search ? <ListGroup /> : <input />}
              <ListGroup />
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
