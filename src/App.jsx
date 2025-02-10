import "./App.css";
import SearchInput from "./components/SearchInput";
import ChatMessage from "./pages/ChatMessage";
import InforChat from "./pages/InforChat";
import ListGroup from "./pages/ListGroup";
import TitleBar from "./pages/TitleBar";
function App() {
  return (
    <>
      <body className="bg-gray-100">
        <div className="flex h-screen">
          <div className="w-1/4 bg-blue-600 text-white flex flex-col">
            <TitleBar name={"Mai Văn Tài"} />
            <SearchInput />
            <ListGroup/>
          </div>
          <ChatMessage/>
          <InforChat />
        </div>
      </body>
    </>
  );
}

export default App;
