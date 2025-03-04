/**
 * OnlineChatBox.tsx
 * 在线聊天框组件
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  loadingComponent = (
    <div data-testid="loading-indicator" className="text-sm text-gray-500">
      正在思考...
    </div>
  ),
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

  // 流式响应相关状态
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] =
    useState<MessageType | null>(null);
  const abortControllerRef = useRef<(() => void) | null>(null);

  // 滚动到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === "function"
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage?.content]);

  useEffect(() => {
    // 组件卸载时取消请求
    return () => {
      if (
        abortControllerRef.current &&
        typeof abortControllerRef.current === "function"
      ) {
        try {
          abortControllerRef.current();
        } catch (error) {
          console.error("取消请求时出错:", error);
        }
      }
    };
  }, []);

  // 将流式消息添加到消息列表
  const addStreamingMessageToList = () => {
    if (currentStreamingMessage && currentStreamingMessage.content) {
      console.log("将流式消息添加到列表:", currentStreamingMessage.id);

      // 清除可能存在的重复消息
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== currentStreamingMessage.id)
      );

      // 添加完整消息到列表
      setMessages((prev) => [
        ...prev,
        {
          ...currentStreamingMessage,
          status: MessageStatus.Success,
        },
      ]);
    }
  };

  // 取消当前请求
  const cancelRequest = useCallback(() => {
    if (
      abortControllerRef.current &&
      typeof abortControllerRef.current === "function"
    ) {
      abortControllerRef.current();
      abortControllerRef.current = null;
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 如果有正在进行的请求，先取消
    cancelRequest();

    // 如果有当前正在流式传输的消息，先添加到消息列表
    if (currentStreamingMessage && currentStreamingMessage.content) {
      addStreamingMessageToList();
    }

    // 重置当前流式消息状态
    setCurrentStreamingMessage(null);

    // 添加用户消息
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: MessageRole.User,
      content,
      timestamp: Date.now(),
      status: MessageStatus.Success, // 直接设置为成功，无需等待
    };

    setMessages((prev) => [...prev, userMessage]);

    // 创建一个初始的AI回复消息（用于流式显示）
    const botMessageId = `bot-${Date.now().toString()}`;
    const initialBotMessage: MessageType = {
      id: botMessageId,
      role: MessageRole.Bot,
      content: "", // 初始为空，会通过流式响应填充
      timestamp: Date.now(),
      status: MessageStatus.Loading,
    };

    setCurrentStreamingMessage(initialBotMessage);
    setIsLoading(true);

    try {
      // 处理数据块的回调函数
      const handleChunk = (chunk: string) => {
        setCurrentStreamingMessage((prev) => {
          if (!prev) return prev;

          // 检查是否为错误消息
          const isErrorMessage =
            chunk.includes("错误") ||
            chunk.includes("出错") ||
            chunk.includes("失败") ||
            chunk.includes("Error");

          // 替换"正在思考..."的初始消息
          if (prev.content === "正在思考...") {
            console.log("替换初始'正在思考...'消息，内容:", chunk);
            return {
              ...prev,
              content: chunk,
              // 如果是错误消息，立即更新状态
              status: isErrorMessage ? MessageStatus.Error : prev.status,
            };
          }

          // 第一次收到正常内容时，记录到控制台
          if (prev.content === "") {
            console.log("收到第一个实际内容块:", chunk);
          }

          // 否则追加内容
          return {
            ...prev,
            content: prev.content + chunk,
            // 如果是错误消息，立即更新状态
            status: isErrorMessage ? MessageStatus.Error : prev.status,
          };
        });
      };

      // 完成回调
      const handleComplete = () => {
        console.log("流式响应完成，消息ID:", botMessageId);

        setCurrentStreamingMessage((prev) => {
          if (!prev) return prev;
          return { ...prev, status: MessageStatus.Success };
        });

        setIsLoading(false);

        // 延迟添加到消息列表，确保状态已更新
        setTimeout(() => {
          addStreamingMessageToList();
        }, 100);
      };

      // 调用API服务，传递回调函数
      abortControllerRef.current = await sendMessageToAPI(
        content,
        [], // 无媒体内容
        handleChunk,
        handleComplete
      );
    } catch (error) {
      console.error("发送消息失败", error);

      // 更新当前流式消息状态为错误
      setCurrentStreamingMessage((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: `发送消息时出错: ${
            error instanceof Error ? error.message : "未知错误"
          }`,
          status: MessageStatus.Error,
        };
      });

      if (onError && error instanceof Error) {
        onError(error);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${messagesClassName}`}
      >
        {messages.length === 0 && !currentStreamingMessage ? (
          emptyStateComponent
        ) : (
          <>
            {messages.map((message) => (
              <Message key={`msg-${message.id}`} message={message} />
            ))}

            {/* 显示当前流式消息，仅当它不是空内容且状态为Loading时 */}
            {currentStreamingMessage && currentStreamingMessage.content && (
              <Message
                key={`stream-${currentStreamingMessage.id}`}
                message={currentStreamingMessage}
                isTyping={
                  currentStreamingMessage.status === MessageStatus.Loading
                }
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
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
