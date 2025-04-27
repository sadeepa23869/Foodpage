import React, { useState } from "react";

const mockConversations = [
  {
    id: 1,
    user: "John Doe",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Hey, how are you?",
    lastTime: "10:15 AM",
    messages: [
      { fromMe: false, text: "Hey, how are you?", time: "10:15 AM" },
      { fromMe: true, text: "I'm good, thanks!", time: "10:16 AM" },
    ],
  },
  {
    id: 2,
    user: "Jane Smith",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "Let's catch up soon!",
    lastTime: "Yesterday",
    messages: [
      { fromMe: false, text: "Let's catch up soon!", time: "Yesterday" },
      { fromMe: true, text: "Sure! Let me know when you're free.", time: "Yesterday" },
    ],
  },
];

const MessageSection = () => {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");
  const [mockConversationsState, setMockConversations] = useState(mockConversations);
  const conversation = mockConversationsState[selected];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMockConversations((prev) =>
      prev.map((conv, idx) =>
        idx === selected
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { text: input, fromMe: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              ],
              lastMessage: input,
              lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : conv
      )
    );
    setInput("");
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-0 border border-gray-200 flex min-h-[500px] max-h-full">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Messages</h2>
        {mockConversationsState.map((conv, idx) => (
          <div
            key={conv.id}
            className={`flex items-center space-x-3 p-2 rounded cursor-pointer mb-2 hover:bg-blue-50 ${selected === idx ? "bg-blue-100" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <img src={conv.photo} alt={conv.user} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{conv.user}</div>
              <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
            </div>
            <div className="text-xs text-gray-400">{conv.lastTime}</div>
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <div className="flex items-center space-x-3 mb-4">
          <img src={conversation.photo} alt={conversation.user} className="w-10 h-10 rounded-full object-cover" />
          <div className="font-semibold text-lg text-blue-700">{conversation.user}</div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 min-h-0">
          {conversation.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} mb-2`}
            >
              <div className={`rounded px-4 py-2 max-w-xs ${msg.fromMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
                <div className="text-xs text-gray-300 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="flex mt-auto" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r font-semibold"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-2">(Messaging is in demo mode)</div>
      </div>
    </div>
  );
};

export default MessageSection;
