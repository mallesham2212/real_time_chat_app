import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../utils/useAuthStore";
import { useChatStore } from "../utils/useChatStore";
import { formatChatTime } from "../utils/formatter";

const Messages = () => {
  const { authUser } = useAuthStore();
  const { messages, selectedUser } = useChatStore();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={isSender ? authUser.profilePic : selectedUser.profilePic}
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-bubble">
                {msg.image && <img src={msg.image} className="rounded-md" />}
                {msg.text && <p>{msg.text}</p>}
              </div>
              <time className="text-xs opacity-50 mt-1">
                {formatChatTime(msg.createdAt)}
              </time>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-center">No messages yet 💬</p>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default Messages;
