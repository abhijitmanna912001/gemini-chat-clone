import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type Chatroom = {
  id: string;
  title: string;
};

type ChatroomStore = {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => Chatroom;
};

export const useChatroomStore = create<ChatroomStore>((set) => ({
  chatrooms: [],
  addChatroom: (title) => {
    const newChatroom = { id: uuidv4(), title };
    set((state) => ({
      chatrooms: [...state.chatrooms, newChatroom],
    }));
    return newChatroom;
  },
}));
