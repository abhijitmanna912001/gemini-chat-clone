import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

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

  // Load messages on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [storageKey]);

  // Auto-save messages on change
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

    // Simulated AI response
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
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4 py-2">
      <ScrollArea className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                alt="uploaded"
                className="w-40 h-auto rounded mb-1"
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
        <div ref={messagesEndRef} />
      </ScrollArea>

      {imagePreview && (
        <div className="mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-auto rounded"
          />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 mt-2"
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
        />
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
