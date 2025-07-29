import { z } from "zod";
import { useChatroomStore } from "./chatroomStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  title: z.string().min(2, "Chatroom title is too short"),
});

type FormData = z.infer<typeof schema>;

export default function ChatroomForm() {
  const createChatroom = useChatroomStore((s) => s.createChatroom);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    createChatroom(data.title);
    toast.success("Chatroom created!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-start">
      <Input placeholder="New chatroom name" {...register("title")} />
      <Button type="submit">Create</Button>
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
    </form>
  );
}
