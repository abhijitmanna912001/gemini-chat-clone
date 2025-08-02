import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  image?: string;
};

export default function ChatroomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !imagePreview) return;

    const message: Message = {
      id: uuidv4(),
      text: newMessage,
      sender: "user",
      timestamp: Date.now(),
      image: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setImagePreview(null);

    setIsTyping(true);

    // Simulated AI reply
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
            {/* Image if present */}
            {msg.image && (
              <img
                src={msg.image}
                alt="sent"
                className="mb-2 max-h-48 rounded-md object-contain"
              />
            )}

            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-muted-foreground">
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

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-2 relative max-w-xs">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-md max-h-48 object-contain"
          />
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            className="absolute top-1 right-1 bg-white px-2 py-0.5 rounded text-sm shadow"
          >
            ❌
          </button>
        </div>
      )}

      {/* Message input and image upload */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex flex-col gap-2 mt-2"
      >
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="text-sm">Upload image:</span>
            <input
              type="file"
              accept="image/*"
              title="Choose an image to upload"
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
              className="text-sm"
            />
          </label>
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
