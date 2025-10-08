import React, { useEffect } from 'react'
import { useChatStore } from '../utils/useChatStore'
import { ChatHeader } from '../pages/ChatHeader'
import SendMessage from '../pages/SendMessage'
import NoChatContainer from './NoChatContainer'
import Messages from './Messages'
import MessageSkeleton from './MessageSkeleton'

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, listenToMessages, clearMessages } = useChatStore()

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id)
      listenToMessages()
    }
    return () => {
      clearMessages()
    }
  }, [selectedUser?._id, listenToMessages, getMessages, clearMessages])

  if (isMessagesLoading) return (
    <div className="flex justify-center items-center h-64">
      <MessageSkeleton />
    </div>
  )

  return (
  
    <div className="flex-1 flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-4rem)]">
      {selectedUser ? (
        <>
          {/* ChatHeader sticky at top */}
          <ChatHeader className="shrink-0 sticky top-0 z-10" />

          {/* Messages scrollable */}
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>

          {/* SendMessage always at bottom */}
          <SendMessage className="shrink-0" />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <NoChatContainer />
        </div>
      )}
    </div>
  )
}

export default ChatContainer
