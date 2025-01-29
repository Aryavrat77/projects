import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Circular UI Button */}
      <div
        onClick={toggleChat}
        className="fixed bottom-5 right-5 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
      >
        <span className="text-white text-2xl">💬</span>
      </div>

      {/* Chat UI Component */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
          <MainContainer>
            <ChatContainer>
              <MessageList>
                <Message
                  model={{
                    message: "Hello my friend",
                    sentTime: "just now",
                    sender: "Joe",
                    direction: "incoming", // Either 'incoming' or 'outgoing'
                    position: "normal",  // Default message position
                  }}
                />
                {/* Add more Message components as needed */}
              </MessageList>
              <MessageInput placeholder="Type message here" />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
};

export default ChatUI;
