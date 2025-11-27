import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("general"); // "general" or "document"

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
          backgroundColor: "#ffffff",
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
            border: "1px solid #e3e3e3",
            borderRadius: "10px",
            backgroundColor: "#fafafa",
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
                    backgroundColor: "#4f7cff",
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
                    backgroundColor: "#e1e6ef",
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
              border: "1px solid #ccc",
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
              backgroundColor: "#4f7cff",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
