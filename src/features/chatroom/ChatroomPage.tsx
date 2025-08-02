import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  image?: string;
};

// Dummy data generator
const generateDummyMessages = (count: number): Message[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    text: `Dummy message ${i + 1}`,
    sender: i % 2 === 0 ? "user" : "ai",
    timestamp: Date.now() - (count - i) * 60000,
  })).reverse();
};

export default function ChatroomPage() {
  const allMessages = useRef<Message[]>(generateDummyMessages(100)); // total data
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const MESSAGES_PER_PAGE = 20;

  // Load paginated messages
  useEffect(() => {
    const end = page * MESSAGES_PER_PAGE;
    const start = Math.max(0, end - MESSAGES_PER_PAGE);
    const pagedMessages = allMessages.current.slice(start, end);
    setMessages(pagedMessages);
  }, [page]);

  // Scroll handler for top detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop === 0 &&
        messages.length < allMessages.current.length
      ) {
        setTimeout(() => setPage((p) => p + 1), 500); // delay to simulate load
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: uuidv4(),
      text: newMessage,
      sender: "user",
      timestamp: Date.now(),
    };

    const updatedAll = [...allMessages.current, message];
    allMessages.current = updatedAll;
    setNewMessage("");

    setMessages(updatedAll.slice(-page * MESSAGES_PER_PAGE));
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        text: "This is a simulated Gemini response ✨",
        sender: "ai",
        timestamp: Date.now(),
      };
      const newAll = [...allMessages.current, aiResponse];
      allMessages.current = newAll;
      setMessages(newAll.slice(-page * MESSAGES_PER_PAGE));
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4 py-2">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2" ref={containerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`relative group p-2 rounded-md max-w-sm ${
              msg.sender === "user"
                ? "bg-blue-100 self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="chat-upload"
                className="rounded mb-1 max-h-48"
              />
            )}
            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(msg.text);
                window.dispatchEvent(
                  new CustomEvent("toast", { detail: "Message copied!" })
                );
              }}
              className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-white shadow hover:bg-gray-100 cursor-pointer"
              title="Copy message"
            >
              <span className="text-sm">📋</span>
            </button>
          </div>
        ))}

        {isTyping && (
          <div className="text-sm text-gray-500 italic">
            Gemini is typing...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 mt-2"
      >
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
