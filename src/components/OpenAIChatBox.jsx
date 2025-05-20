// src/components/OpenAIChatBox.jsx
import axios from "axios";
import { useState } from "react";
import config from "../constant/linkApi";

const OpenAIChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(config.API_URL+"/AI?question="+input);
      const reply = response;
      console.log(reply)
      const formattedReply = {
        role: "assistant",
        content: reply.data.trim(),
      };
      setMessages((prev) => [...prev, formattedReply]);
    } catch (err) {
      console.error("OpenAI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left"
              }`}
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-gray-500 text-left">Đang trả lời...</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {input.trim() && (
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Gửi
          </button>
        )}
      </div>
    </div>
  );
};

export default OpenAIChatBox;
