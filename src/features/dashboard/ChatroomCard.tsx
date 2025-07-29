import { useNavigate } from "react-router";
import { useChatroomStore } from "./chatroomStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  title: string;
  createdAt: string;
};

export default function ChatroomCard({ id, title, createdAt }: Readonly<Props>) {
  const deleteChatroom = useChatroomStore((s) => s.deleteChatroom);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this chatroom?")) {
      deleteChatroom(id);
      toast.success("Chatroom deleted");
    }
  };

  return (
    <button
      className="w-full text-left border rounded p-4 flex justify-between items-center hover:shadow"
      onClick={() => navigate(`/chat/${id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/chat/${id}`)}
    >
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <Button
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        Delete
      </Button>
    </button>
  );
}
