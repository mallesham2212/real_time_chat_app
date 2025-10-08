import { create } from "zustand";
import { axiosInstance } from "./axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const baseURL =
  import.meta.env.VITE_API_URL === "development"
    ? "http://localhost:5000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigninIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  chekAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        withCredentials: true,
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checkAuth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data.LoggedInUser });
      toast.success("Signup successful 🎉");
      get().connectSocket();
    } catch (error) {
      const message =
        error.response?.data || "Signup failed, please try again!";
      toast.error(message);
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },
  profileRoute: async (data) => {
    try {
      set({ authUser: data });
    } catch (error) {
      toast.error(error.response?.data);
    }
  },
  login: async (form) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", form);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged in successful 🎉");
    } catch (error) {
      const message = error.response?.data || "Loginn failed please try again!";
      toast.error(message);
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      useChatStore.getState().clearChatStore();
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again!");
    }
  },
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.post("/auth/updateprofile", data, {
        withCredentials: true,
      });
      set({ authUser: res.data.updatedUser }); // ✅ plain user
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Updating profile failed, please try again!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;
    const socket = io(baseURL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("onlineUsers", (userId) => {
      set({ onlineUsers: userId });
    });
  },
  disconnectSocket: () => {
    if (get().socket.connected) get().socket.disconnect();
  },
}));
