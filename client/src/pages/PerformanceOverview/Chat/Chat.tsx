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
      {/* Target: Updated title style */}
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Bedrock Analysis</h2>
       {/* Target: Add subtitle */}
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        AI model performance metrics
      </p>
      {/* Target: White background, border, adjust padding */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-white dark:bg-dark-cont-m p-4 border border-gray-200 dark:border-gray-700 rounded-t-md transition-colors mb-0"> {/* Removed mb-2 */}
        {messages.length === 0 && !loading && ( // Show placeholder if no messages
           <div className="text-center text-gray-400 dark:text-gray-500 pt-10">
             No conversation yet. Ask something about your performance data!
           </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              // Target: Refined bubble styles
              className={`max-w-[85%] rounded-lg px-3.5 py-2 text-sm shadow-sm ${ // Added shadow-sm back for definition
                msg.role === "user"
                  ? "bg-blue-600 text-white" // Keep user messages distinct
                  : "bg-gray-100 dark:bg-dark-cont-s text-gray-800 dark:text-dark-text-prim" // Lighter assistant messages
              } transition-colors`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-lg px-3.5 py-2 text-sm bg-gray-100 dark:bg-dark-cont-s text-gray-500 dark:text-dark-text-sec transition-colors shadow-sm">
              <p className="whitespace-pre-wrap break-words italic">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      {/* Target: Input area with border top */}
      <div className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-cont-l rounded-b-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about performance..."
          disabled={loading || !currentUser}
           // Target: Input field style matching buttons
          className="flex-1 px-3 py-1.5 rounded-md bg-gray-50 dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-dark-text-prim disabled:opacity-60 transition-colors text-sm outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !currentUser || input.trim() === ''} // Disable if input is empty
          // Target: Send button style
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md border-0 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-dark-cont-l disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
