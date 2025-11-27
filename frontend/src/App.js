import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("general"); // "general" or "document"
  const [darkMode, setDarkMode] = useState(false);



  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { user: message, mode };
    setChat([...chat, userMsg]);
    setMessage("");
    setLoading(true);

    // Decide which endpoint to call
    const endpoint =
      mode === "general"
        ? "http://127.0.0.1:9000/chat"
        : "http://127.0.0.1:9000/ask-document";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });


    const data = await res.json();

    // For document mode backend returns { answer: "...", context_used: [...] }
    const botText = mode === "general" ? data.reply : data.answer;

    const botMsg = { bot: botText, mode };
    setChat((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f2f4f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "480px",
          height: "90vh",
          backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
          color: darkMode ? "white" : "black",
          borderRadius: "12px",

          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          🤖 My AI Chatbot
        </h2>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", justifyContent: "center" }}>
          <span style={{ fontSize: "14px" }}>
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </span>

          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "45px",
              height: "22px",
              borderRadius: "15px",
              backgroundColor: darkMode ? "#4f7cff" : "#ccc",
              position: "relative",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "white",
                position: "absolute",
                top: "1px",
                left: darkMode ? "23px" : "1px",
                transition: "0.3s"
              }}
            ></div>
          </div>
        </label>



        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={() => setMode("general")}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                mode === "general" ? "#4f7cff" : "#e1e6ef",
              color: mode === "general" ? "white" : "black",
              fontSize: "12px",
            }}
          >
            General Chat
          </button>
          <button
            onClick={() => setMode("document")}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                mode === "document" ? "#4f7cff" : "#e1e6ef",
              color: mode === "document" ? "white" : "black",
              fontSize: "12px",
            }}
          >
            Document Chat
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "15px",
            padding: "10px",
            border: darkMode ? "1px solid #555" : "1px solid #e3e3e3",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#2a2a2a" : "#fafafa",
            color: darkMode ? "white" : "black",
          }}
        >
          {chat.map((c, i) =>
            c.user ? (
              <div
                key={i}
                style={{
                  textAlign: "right",
                  margin: "10px 0",
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: darkMode ? "#3b5bff" : "#4f7cff",
                    color: "white",
                    padding: "10px 14px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {c.user}
                  {c.mode === "document" && (
                    <span style={{ fontSize: "10px", marginLeft: 6 }}>
                      (doc)
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div
                key={i}
                style={{
                  textAlign: "left",
                  margin: "10px 0",
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: darkMode ? "#3a3a3a" : "#e1e6ef",
                    color: darkMode ? "white" : "black",
                    padding: "10px 14px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {c.bot}
                  {c.mode === "document" && (
                    <span style={{ fontSize: "10px", marginLeft: 6 }}>
                      (from doc)
                    </span>
                  )}
                </span>
              </div>
            )
          )}

          {loading && <p><em>Bot is thinking...</em></p>}
        </div>

        <div style={{ display: "flex" }}>
          <input
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: darkMode ? "#2b2b2b" : "white",
              color: darkMode ? "white" : "black",
              border: darkMode ? "1px solid #555" : "1px solid #ccc",
              marginRight: "10px",
            }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            mode === "general"
              ? "Ask anything..."
              : "Ask from uploaded document..."
          }
          />

          <button
            style={{
              padding: "12px 18px",
              backgroundColor: "#6350d0ff",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={sendMessage}
          >
            Send
          </button>
          <button
            onClick={() => setChat([])}
            style={{
              padding: "12px 18px",
              backgroundColor: "#a70d0dff",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;
