import { useEffect, useMemo, useState } from "react";
import { useChatroomStore } from "./chatroomStore";
import { debounce } from "lodash";
import ChatroomForm from "./ChatroomForm";
import { Input } from "@/components/ui/input";
import ChatroomCard from "./ChatroomCard";

export default function DashboardPage() {
  const { chatrooms } = useChatroomStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(chatrooms);

  const handleSearch = useMemo(
    () =>
      debounce((term: string) => {
        const results = chatrooms.filter((c) =>
          c.title.toLowerCase().includes(term.toLowerCase())
        );
        setFiltered(results);
      }, 300),
    [chatrooms]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Chatrooms</h1>
      <ChatroomForm />
      <Input
        placeholder="Search chatrooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-2">
        {filtered.map((room) => (
          <ChatroomCard key={room.id} {...room} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground">No chatrooms found</p>
        )}
      </div>
    </div>
  );
}
