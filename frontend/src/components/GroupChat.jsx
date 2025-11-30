import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/useAuth";

const socket = io(import.meta.env.VITE_API_URL);

export default function GroupChat({ groupId }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!groupId) return;

    socket.emit("join_group", groupId);

    socket.on("receive_message", (payload) => {
      if (payload.groupId === groupId) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    return () => {
      socket.emit("leave_group", groupId);
      socket.off("receive_message");
    };
  }, [groupId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      groupId,
      message: text.trim(),
      user: user.name,
    });

    setText("");
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Group Chat 💬</h2>

      <div className="h-64 overflow-y-auto p-3 bg-gray-100 rounded-lg shadow-inner mb-3">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-semibold">{msg.user}:</span>{" "}
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
