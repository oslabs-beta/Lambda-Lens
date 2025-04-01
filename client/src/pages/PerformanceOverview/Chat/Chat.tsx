import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 

const ChatContainer = () => {
  const { currentUser } = useAuth(); 
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "" || !currentUser) { 
        if (!currentUser) alert("Please log in to use the chat.");
        return;
    }

    const userMessage = input.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);
    setInput("");
    setLoading(true);

    try {
      const token = await currentUser.getIdToken(); 

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`, 
        {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) {
        let errorMsg = "Network response was not ok";
        try {
            const errorData = await response.json();
            errorMsg = errorData.message?.err || errorData.err || errorMsg;
        } catch (parseError) {
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            data.result ||
            "I'm sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && input.trim() !== "") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#161616] dark:text-white">Bedrock Analysis</h2>
      <div className="flex-1 overflow-y-auto space-y-2 bg-[#e1e1e1] dark:bg-[#363636] p-3 rounded-lg transition-colors">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-2.5 ${
                msg.role === "user"
                  ? "bg-[#447A90] text-white"
                  : "bg-[#e1e1e1] dark:bg-[#404040] text-[#161616] dark:text-white"
              } transition-colors`}
            >
              <div className="font-semibold mb-0.5">
                {msg.role === "user" ? "You" : "Assistant"}:
              </div>
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <div className="max-w-[80%] rounded-lg p-2.5 bg-[#e1e1e1] dark:bg-[#404040] text-[#161616] dark:text-white transition-colors">
              <div className="font-semibold mb-0.5">Assistant:</div>
              <p className="whitespace-pre-wrap break-words">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={loading || !currentUser} 
          className="flex-1 p-2 rounded-lg bg-[#e1e1e1] hover:bg-[#f3f3f3] dark:bg-[#363636] dark:hover:bg-[#404040] text-[#161616] dark:text-[#a2a2a2] outline-none border-0 focus:ring-2 focus:ring-[#447A90] dark:focus:ring-[#62ACCC] disabled:opacity-50 transition-colors"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !currentUser} 
          className="px-4 py-2 bg-[#447A90] hover:bg-[#62ACCC] text-white rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#447A90] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
