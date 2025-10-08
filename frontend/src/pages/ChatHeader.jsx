import React from "react";
import { useChatStore } from "../utils/useChatStore";
import { useAuthStore } from "../utils/useAuthStore";
import { X } from "lucide-react"; // for close icon

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleRemove = () => {
    setSelectedUser(null);
  };

  if (!selectedUser) return null;
  const isOnline = onlineUsers?.includes(selectedUser?._id);
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b bg-gray-50 md:px-6">
      {/* Left Section: Profile + Name + Status */}
      <div className="flex items-+center gap-3">
        <div className="relative">
          <img
            src={selectedUser?.profilePic || "https://via.placeholder.com/40"}
            alt={selectedUser?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
            {selectedUser?.fullName}
          </h2>
          <p
            className={`text-xs ${
              isOnline ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right Section: Close button */}
      <button
        onClick={handleRemove}
        className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition"
        title="Close chat"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>
    </header>
  );
};
