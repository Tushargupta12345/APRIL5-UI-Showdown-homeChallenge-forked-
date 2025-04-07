import { useState, useEffect } from "react";

type BasicMessage = {
  id: number;
  content: string;
  role: "user" | "bot";
  options?: { label: string; action: string }[];
  time: string;
  type?: "response" | "thanks";
};

const ChatInterface = () => {
  const [creativity, setCreativity] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(3072);
  const [webSearch, setWebSearch] = useState(false);
  const [memoryRetention, setMemoryRetention] = useState(true);
  const [conversations, setConversations] = useState<{id: number, title: string}[]>([
    { id: 1, title: "New Conversation" }
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<BasicMessage[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const getCurrentTime = () => {
    if (typeof window === 'undefined') return '';
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    setIsMounted(true);
    // Show initial greeting only if no messages exist
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          content: "Hello! I'm here to help. What would you like to know about?",
          role: "bot",
          time: getCurrentTime(),
          type: "thanks",
          options: [
            { label: "Tell me a fact", action: "fact" },
            { label: "Give me advice", action: "advice" },
            { label: "Share a quote", action: "quote" },
          ],
        },
      ]);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: BasicMessage = {
      id: Date.now(),
      content: input,
      role: "user",
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTimeout(() => handleBotResponse(input.toLowerCase()), 500);
  };

  const handleOptionClick = (option: string) => {
    const userMessage: BasicMessage = {
      id: Date.now(),
      content: option,
      role: "user",
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => handleBotResponse(option.toLowerCase()), 500);
  };

  const handleBotResponse = (input: string) => {
    let response = "";
    switch (input) {
      case "tell me a fact":
      case "fact":
        response = "Did you know? Honey never spoils.";
        break;
      case "give me advice":
      case "advice":
        response = "Don't wait for the perfect moment. Take a moment and make it perfect.";
        break;
      case "share a quote":
      case "quote":
        response = "“The best way to get started is to quit talking and begin doing.” – Walt Disney";
        break;
      default:
        //response = "I'm not sure how to respond.";
        break;
    }

    const thanksMessage: BasicMessage = {
      id: Date.now() + 1,
      content: "Thanks for your message! Please select one of these options:",
      role: "bot",
      time: getCurrentTime(),
      type: "thanks",
      options: [
        { label: "Tell me a fact", action: "fact" },
        { label: "Give me advice", action: "advice" },
        { label: "Share a quote", action: "quote" },
      ],
    };

    if (response) {
      const botResponse: BasicMessage = {
        id: Date.now(),
        content: response,
        role: "bot",
        time: getCurrentTime(),
        type: "response"
      };
      setMessages((prev) => [...prev, botResponse, thanksMessage]);
    } else {
      setMessages((prev) => [...prev, thanksMessage]);
    }
  };

  const handleNewConversation = () => {
    const newId = Date.now();
    setConversations(prev => [...prev, { id: newId, title: `Conversation ${prev.length + 1}` }]);
    setActiveConversation(newId);
    setMessages([
      {
        id: Date.now(),
        content: "Hello! I'm here to help. What would you like to know about?",
        role: "bot",
        time: getCurrentTime(),
        type: "thanks",
        options: [
          { label: "Tell me a fact", action: "fact" },
          { label: "Give me advice", action: "advice" },
          { label: "Share a quote", action: "quote" },
        ],
      },
    ]);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      {/* Left bar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={handleNewConversation}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            New Conversation
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              className={`p-2 rounded cursor-pointer ${activeConversation === conv.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveConversation(conv.id)}
            >
              {conv.title}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <h3 className="font-medium mb-2">Configuration</h3>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Creativity: {creativity.toFixed(1)}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Max Tokens: {maxTokens}</label>
            <input 
              type="range" 
              min="512" 
              max="4096" 
              step="256"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="webSearch"
              checked={webSearch}
              onChange={(e) => setWebSearch(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="webSearch" className="text-sm">Web Search</label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="memoryRetention"
              checked={memoryRetention}
              onChange={(e) => setMemoryRetention(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="memoryRetention" className="text-sm">Memory Retention</label>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold">Summary</h2>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {isMounted && messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.time && (
                  <div className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.time}
                  </div>
                )}
              </div>
              
              {message.type === "thanks" && message.options && (
                <div className="mt-3">
                  <div className="inline-block bg-white border border-gray-200 rounded-lg p-2 w-full max-w-[80%]">
                    <table className="w-full">
                      <tbody>
                        {message.options.map((opt, index) => (
                          <tr 
                            key={opt.action}
                            className={`cursor-pointer hover:bg-gray-100 ${
                              index < message.options!.length - 1 ? 'border-b border-gray-200' : ''
                            }`}
                            onClick={() => handleOptionClick(opt.label)}
                          >
                            <td className="py-2 px-3">{opt.label}</td>
                            <td className="w-8 text-right pr-2">›</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;