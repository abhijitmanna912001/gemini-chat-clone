import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

type Chatroom = {
  id: string;
  name: string;
};

export default function ChatroomListPage() {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newName, setNewName] = useState("");

  // Load chatrooms from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chatrooms");
    if (stored) {
      setChatrooms(JSON.parse(stored));
    }
  }, []);

  // Save chatrooms to localStorage when changed
  useEffect(() => {
    localStorage.setItem("chatrooms", JSON.stringify(chatrooms));
  }, [chatrooms]);

  const createChatroom = () => {
    if (!newName.trim()) return;

    const newRoom: Chatroom = {
      id: uuidv4(),
      name: newName.trim(),
    };

    setChatrooms((prev) => [...prev, newRoom]);
    setNewName("");
    window.dispatchEvent(
      new CustomEvent("toast", { detail: "Chatroom created" })
    );
  };

  const deleteChatroom = (id: string) => {
    setChatrooms((prev) => prev.filter((r) => r.id !== id));
    window.dispatchEvent(
      new CustomEvent("toast", { detail: "Chatroom deleted" })
    );
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Chatrooms</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New chatroom name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button onClick={createChatroom}>Create</Button>
      </div>

      <div className="space-y-3">
        {chatrooms.length === 0 && (
          <p className="text-sm text-muted-foreground">No chatrooms yet.</p>
        )}
        {chatrooms.map((room) => (
          <Card key={room.id} className="p-3 flex items-center justify-between">
            <Link
              to={`/chat/${room.id}`}
              className="text-blue-600 hover:underline"
            >
              {room.name}
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteChatroom(room.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
