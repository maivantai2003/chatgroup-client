import { useSelector } from "react-redux";
import "./App.css";
import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import ListGroup from "./pages/ListGroup";
import LoginForm from "./pages/Login";
import TitleBar from "./pages/TitleBar";
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>{
      isAuthenticated?(
        <div className="bg-gray-100">
        <div className="flex h-screen">
          <div className="w-1/4 bg-blue-600 text-white flex flex-col">
            <TitleBar name={"Mai Văn Tài"} />
            <SearchInput />
            <ListGroup/>
          </div>
          <ChatMessage/>
          <InforChat />
        </div>
      </div>
      ):
      <LoginForm/>
    }
      
    </>
  );
}

export default App;
