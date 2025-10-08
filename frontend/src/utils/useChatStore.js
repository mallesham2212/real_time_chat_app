import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "./axios";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/getUsers");
      set({ users: res.data });
    } catch (error) {
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) {
      console.warn("⚠️ getMessages called with undefined userId");
      return;
    }
    try {
      set({ isMessagesLoading: true });

      const res = await axiosInstance.get("/messages/getMessages/" + userId);
      console.log("Messages response:", res.data);
      set({
        messages: res.data.allMessages || [],
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] });
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (user) => set({ selectedUser: user }),

  clearChatStore: () =>
    set({
      users: [],
      messages: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
    }),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `messages/sendMessage/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  listenToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, message],
      });
    });
  },

  clearMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
