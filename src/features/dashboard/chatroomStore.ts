import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Chatroom = {
  id: string;
  title: string;
  createdAt: string;
};

type State = {
  chatrooms: Chatroom[];
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
};

export const useChatroomStore = create<State>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      createChatroom: (title) => {
        const newRoom: Chatroom = {
          id: crypto.randomUUID(),
          title,
          createdAt: new Date().toISOString(),
        };
        set({ chatrooms: [newRoom, ...get().chatrooms] });
      },
      deleteChatroom: (id) => {
        set({ chatrooms: get().chatrooms.filter((r) => r.id !== id) });
      },
    }),
    {
      name: "chatrooms",
    }
  )
);
