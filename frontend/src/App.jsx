import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [user, setUser] = useState("User " + Math.floor(Math.random() * 1000));
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

   const sendMessage = () => {
    if (text.trim()) {
      socket.emit("chatMessage", { user, text });
    }
    // setText("");
  };
  useEffect(() => {
    // Load previous messages
    axios.get("http://localhost:5000/api/messages").then((res) => {
      setMessages(res.data);
    });

    // Listen for new messages
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // return () => socket.disconnect();
  }, []);

 

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat as {user}</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid gray", padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.user}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
