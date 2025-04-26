import React, { useState, useRef, useEffect } from "react";

const GEMINI_API_KEY = "AIzaSyAsHnLs9Xx27jO-Dvd_w7efGTSlhawSytE";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const initialMessages = [
  { from: "bot", text: "Hi! I'm your AI assistant. How can I help you today?" },
];

// Helper to format chatbot response, including clickable links (plain and markdown)
function formatBotResponse(text) {
  let formatted = text
    // Convert markdown links [desc](url) to clickable links
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">$1</a>')
    // Convert plain URLs to clickable links (skip those already inside <a>)
    .replace(/(^|[^"'=\]])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">$2</a>')
    // Headings: **Title:** or **Title**
    .replace(/\*\*([^*]+)\*\*:?/g, '<strong>$1</strong>')
    // Numbered lists: 1. ...
    .replace(/\n(\d+)\. /g, '<br/><strong>$1.</strong> ')
    // Bullet points: * ...
    .replace(/\n\* /g, '<br/>&bull; ')
    // Sub-bullets:   * ...
    .replace(/\n\s+\* /g, '<br/>&nbsp;&nbsp;&nbsp;&bull; ')
    // Newlines to <br/>
    .replace(/\n/g, '<br/>');
  return formatted;
}

const AIChatbotSection = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Gemini expects an array of 'contents', each with 'parts'
      const contents = [
        {
          parts: [{ text: input }],
        },
      ];

      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      });
      if (!res.ok) throw new Error("Failed to get response from Gemini");
      const data = await res.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't get a response.";
      setMessages((msgs) => [...msgs, { from: "bot", text: aiText, formatted: formatBotResponse(aiText) }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Error: " + err.message, formatted: formatBotResponse("Error: " + err.message) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-200 flex flex-col h-full w-full">
      <h3 className="text-lg font-semibold text-blue-700 mb-2 p-4 border-b">AI Chatbot</h3>
      <div className="flex-1 overflow-y-auto mb-2 px-4 py-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded px-3 py-2 max-w-xs text-sm ${
                msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={msg.from === "bot" && msg.formatted ? { __html: msg.formatted } : undefined}
            >
              {msg.from === "bot" && msg.formatted ? null : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-2 flex justify-start">
            <div className="rounded px-3 py-2 max-w-xs text-sm bg-gray-200 text-gray-800">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="flex mt-auto p-4 border-t" onSubmit={handleSend}>
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition font-semibold"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChatbotSection;