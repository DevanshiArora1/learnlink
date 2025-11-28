import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

export default function GroupChat({ groupId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join_group", groupId);

    socket.on("receive_message", (payload) => {
      if (payload.groupId === groupId) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [groupId]);

  const send = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      groupId,
      message: text.trim(),
      user: currentUser.name,
    });

    setText("");
  };

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="h-60 overflow-y-auto mb-3 bg-white p-3 rounded shadow-inner">
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold text-sm">{m.user}: </span>
            <span className="text-sm">{m.message}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 p-2 border rounded-lg bg-gray-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
