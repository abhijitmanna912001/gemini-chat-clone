import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  image?: string;
};

export default function ChatroomPage() {
  const { chatId } = useParams();
  const storageKey = `chat-messages-${chatId}`;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !imagePreview) return;

    const message: Message = {
      id: uuidv4(),
      text: newMessage,
      image: imagePreview || undefined,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setImagePreview(null);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        text: "This is a simulated Gemini response ✨",
        sender: "ai",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4 py-3 dark:bg-black dark:text-white">
      {/* Back button */}
      <div className="mb-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Chatrooms
        </button>
      </div>

      {/* Message area */}
      <ScrollArea className="flex-1 overflow-y-auto space-y-4 pr-2 mb-2 border rounded-lg p-3 bg-white dark:bg-zinc-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative group p-3 rounded-xl max-w-xs sm:max-w-sm break-words
                ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white"
                }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Sent"
                  className="w-40 h-auto mb-2 rounded"
                />
              )}
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 text-right ${
                  msg.sender === "user"
                    ? "text-blue-100"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>

              {/* Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(msg.text);
                  window.dispatchEvent(
                    new CustomEvent("toast", { detail: "Message copied!" })
                  );
                }}
                className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-800 shadow hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                title="Copy message"
              >
                <span className="text-sm">📋</span>
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="italic text-sm text-gray-500 dark:text-gray-400">
            Gemini is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-auto rounded"
          />
        </div>
      )}

      {/* Message Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex flex-col sm:flex-row gap-2 items-center"
      >
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="text-sm file:mr-2 file:px-2 file:py-1 file:border-0 file:rounded file:bg-blue-100 file:text-blue-700 dark:file:bg-zinc-800 dark:file:text-blue-300"
        />
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" className="w-full sm:w-auto">
          Send
        </Button>
      </form>
    </div>
  );
}
