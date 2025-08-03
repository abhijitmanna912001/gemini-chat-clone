import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatroomStore } from "@/store/chatrooms";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ChatroomListPage() {
  const { chatrooms, addChatroom, deleteChatroom } = useChatroomStore();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!title.trim()) return;
    const newChat = addChatroom(title.trim());
    setTitle("");
    navigate(`/chat/${newChat.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Chatrooms</h1>
        <ModeToggle />
      </div>

      {chatrooms.length === 0 && (
        <p className="text-muted-foreground text-center">
          No chatrooms yet. Create one below!
        </p>
      )}

      <ul className="space-y-3">
        {chatrooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition"
          >
            <button
              className="text-left text-base font-medium text-primary hover:underline flex-1"
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              {room.title}
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteChatroom(room.id)}
              title="Delete chatroom"
              className="text-red-500 hover:bg-red-500 dark:hover:bg-red-900"
            >
              🗑️
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chatroom title"
          className="flex-1"
        />
        <Button onClick={handleCreate} className="whitespace-nowrap">
          New Chat
        </Button>
      </div>
    </div>
  );
}
