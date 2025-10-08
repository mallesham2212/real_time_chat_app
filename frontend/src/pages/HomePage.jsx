import React, { useEffect, useState } from "react";
import { useAuthStore } from "../utils/useAuthStore";
import { useChatStore } from "../utils/useChatStore";
import ChatContainer from "../components/ChatContainer";
import UsersSkeleton from "../skeletons/UsersSkeleton";

const HomePage = () => {
  const { onlineUsers } = useAuthStore();
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser, getMessages } = useChatStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = showOnlineUsers
    ? users.filter((u) => onlineUsers?.includes(u._id))
    : users;

  const handleMessages = (user) => {
    setSelectedUser(user);
    getMessages(user._id);
  };

  const renderUserItem = (u) => {
  const isSelected = selectedUser?._id === u._id;
  const isOnline = onlineUsers?.includes(u._id);
  return (
    <li
      key={u._id}
      onClick={() => handleMessages(u)}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
        ${isSelected ? "bg-gray-300" : "hover:bg-gray-200"}`}
    >
      <div className="relative">
        <img
          src={u.profilePic || "https://via.placeholder.com/40"}
          alt={u.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div>
        <span className="font-medium">{u.fullName}</span>
        <p className={`text-xs ${isOnline ? "text-green-600" : "text-gray-500"}`}>
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </li>
  );
};
  return (
    <div className="flex flex-col md:flex-row" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-100 border-r p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <label className="flex gap-2 items-center text-sm">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={() => setShowOnlineUsers(!showOnlineUsers)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <span className="text-gray-700">Online</span>
          </label>
        </div>
        {isUsersLoading ? (
          <UsersSkeleton count={8} />
        ) : filteredUsers.length > 0 ? (
          <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-100px)]">
            {filteredUsers.map(renderUserItem)}
          </ul>
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden bg-gray-100 p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-sm font-medium">Users</h2>
          <label className="flex gap-1 items-center text-xs">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={() => setShowOnlineUsers(!showOnlineUsers)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <span>Online</span>
          </label>
        </div>
        {isUsersLoading ? (
          <UsersSkeleton count={5} />
        ) : filteredUsers.length > 0 ? (
          <div className="flex space-x-3 overflow-x-auto">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => handleMessages(u)}
                className={`flex flex-col items-center p-2 rounded-lg transition ${
                  selectedUser?._id === u._id ? "bg-gray-300" : "hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {onlineUsers?.includes(u._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <span className="text-xs text-gray-700 mt-1 truncate w-12 text-center">
                  {u.fullName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 px-2">No users found</p>
        )}
      </div>

      <ChatContainer />
    </div>
  );
};

export default HomePage;
