import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

type Chatroom = {
  id: string;
  title: string;
};

type ChatroomStore = {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => Chatroom;
  deleteChatroom: (id: string) => void;
};

export const useChatroomStore = create<ChatroomStore>()(
  persist(
    (set) => ({
      chatrooms: [],
      addChatroom: (title) => {
        const newChatroom = { id: uuidv4(), title };
        set((state) => ({
          chatrooms: [...state.chatrooms, newChatroom],
        }));
        return newChatroom;
      },
      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
        }));
      },
    }),
    {
      name: "chatroom-storage", // key for localStorage
    }
  )
);
