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
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Your Chatrooms</h1>

      {chatrooms.length === 0 && (
        <p className="text-gray-500">No chatrooms yet. Create one below!</p>
      )}

      <ul className="space-y-2">
        {chatrooms.map((room) => (
          <li key={room.id}>
            <Button
              className="w-full justify-start"
              variant="secondary"
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              {room.title}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteChatroom(room.id)}
              title="Delete chatroom"
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
        />
        <Button onClick={handleCreate}>New Chat</Button>
      </div>
    </div>
  );
}
