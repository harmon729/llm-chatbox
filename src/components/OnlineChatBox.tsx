/**
 * OnlineChatBox.tsx
 * 在线聊天框组件
 */

import React, { useState } from "react";
import {
  Message as MessageType,
  MessageRole,
  MessageStatus,
} from "@/types/chat";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { sendMessageToAPI } from "@/services/apiService";

export interface OnlineChatBoxProps {
  initialMessages?: MessageType[];
  systemMessage?: string;
  className?: string;
  inputClassName?: string;
  messagesClassName?: string;
  placeholder?: string;
  loadingComponent?: React.ReactNode;
  emptyStateComponent?: React.ReactNode;
  onError?: (error: Error) => void;
}

/**
 * 在线聊天框组件
 * 提供一个完整的聊天界面，包括消息列表和输入框
 *
 * @param {OnlineChatBoxProps} props - 组件属性
 * @returns {JSX.Element} 渲染的聊天框组件
 */
const OnlineChatBox: React.FC<OnlineChatBoxProps> = ({
  initialMessages = [],
  systemMessage,
  className = "",
  inputClassName = "",
  messagesClassName = "",
  placeholder = "输入消息...",
  loadingComponent = <div className="text-sm text-gray-500">正在思考...</div>,
  emptyStateComponent = (
    <div className="text-center text-gray-500 p-4">
      开始对话吧！发送一条消息。
    </div>
  ),
  onError,
}) => {
  const [messages, setMessages] = useState<MessageType[]>(() => {
    const msgs = [...initialMessages];
    if (systemMessage) {
      msgs.unshift({
        id: "system-message",
        role: MessageRole.Bot,
        content: systemMessage,
        timestamp: Date.now(),
        status: MessageStatus.Success,
      });
    }
    return msgs;
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: MessageRole.User,
      content,
      timestamp: Date.now(),
      status: MessageStatus.Sending,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 调用API服务
      const response = await sendMessageToAPI(content);

      // 添加AI回复
      const botMessage: MessageType = {
        id: Date.now().toString(),
        role: MessageRole.Bot,
        content: response,
        timestamp: Date.now(),
        status: MessageStatus.Success,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("发送消息失败", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${messagesClassName}`}
      >
        {messages.length === 0
          ? emptyStateComponent
          : messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

        {isLoading && loadingComponent}
      </div>

      <div className="border-t border-gray-200 p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={placeholder}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default OnlineChatBox;
