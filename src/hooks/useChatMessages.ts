/**
 * useChatMessages.ts
 * 聊天消息管理Hook - 处理消息状态和AI交互
 *
 * 该自定义Hook提供了管理聊天消息的全部功能：
 * - 存储和更新消息列表
 * - 发送消息到AI服务并处理流式响应
 * - 管理加载状态
 * - 提供取消请求功能
 * - 清空聊天历史
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Message, // 消息接口
  MessageRole, // 消息角色枚举
  MessageStatus, // 消息状态枚举
  MediaContent, // 媒体内容接口
} from "@/types/chat";
import { sendMessageToAI } from "@/services/apiService";

/**
 * 生成唯一ID
 * 使用时间戳和随机字符串组合创建唯一标识符
 *
 * @returns {string} 生成的唯一ID字符串
 */
const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

/**
 * 创建用户消息对象
 *
 * @param {string} content - 消息文本内容
 * @param {MediaContent[]} [media] - 可选的媒体内容数组
 * @returns {Message} 创建的用户消息对象
 */
const createUserMessage = (
  content: string,
  media?: MediaContent[]
): Message => {
  return {
    id: generateId(), // 使用生成器创建唯一ID
    role: MessageRole.User, // 设置角色为用户
    content, // 设置消息内容
    media, // 设置媒体内容(如果有)
    status: MessageStatus.Success, // 用户消息默认为成功状态
    timestamp: Date.now(), // 使用当前时间作为时间戳
  };
};

/**
 * 创建机器人(AI)消息对象
 *
 * @param {string} [content=""] - 消息文本内容，默认为空字符串
 * @param {MessageStatus} [status=MessageStatus.Sending] - 消息状态，默认为发送中
 * @returns {Message} 创建的机器人消息对象
 */
const createBotMessage = (
  content: string = "",
  status: MessageStatus = MessageStatus.Sending
): Message => {
  return {
    id: generateId(), // 使用生成器创建唯一ID
    role: MessageRole.Bot, // 设置角色为机器人
    content, // 设置消息内容
    status, // 设置消息状态
    timestamp: Date.now(), // 使用当前时间作为时间戳
  };
};

/**
 * 聊天消息管理Hook
 * 提供消息状态管理和与AI交互的功能
 *
 * @returns {Object} 包含消息状态和操作函数的对象
 */
export const useChatMessages = (initialMessages: Message[] = []) => {
  // 使用useState钩子管理消息列表状态
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // 使用useState钩子管理加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 使用useState钩子管理错误状态
  const [error, setError] = useState<Error | null>(null);

  // 使用useRef保存取消当前请求的函数
  // useRef返回一个可变对象，其.current属性被初始化为传入的参数
  // useRef的值在组件的整个生命周期内保持不变
  const cancelRequest = useRef<(() => void) | null>(null);

  /**
   * 添加新消息
   *
   * @param {Message} message - 要添加的消息对象
   * @returns {string} 添加的消息ID
   */
  const addMessage = useCallback((message: Message): string => {
    const newMessage = {
      ...message,
      id: message.id || generateId(),
      timestamp: message.timestamp || Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  /**
   * 更新最后一条消息
   *
   * @param {string} content - 更新后的消息内容
   */
  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;

      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      newMessages[lastIndex] = {
        ...newMessages[lastIndex],
        content,
        status: MessageStatus.Success,
      };

      return newMessages;
    });
  }, []);

  /**
   * 删除指定ID的消息
   *
   * @param {string} id - 要删除的消息ID
   */
  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  /**
   * 发送消息到AI
   * 创建用户和机器人消息，发送请求并处理流式响应
   *
   * useCallback钩子用于记忆函数，防止不必要的重新渲染
   *
   * @param {string} text - 要发送的消息文本
   * @param {MediaContent[]} [media=[]] - 要发送的媒体内容数组
   */
  const sendMessage = useCallback(
    async (text: string, media: MediaContent[] = []) => {
      // 验证输入，如果文本为空且没有媒体，则不发送
      if (!text.trim() && (!media || media.length === 0)) {
        return;
      }

      // 如果有正在进行的请求，先取消它
      if (cancelRequest.current) {
        cancelRequest.current();
        cancelRequest.current = null;
      }

      // 清除之前的错误
      setError(null);

      // 创建用户消息对象
      const userMessage = createUserMessage(text, media);

      // 创建初始机器人消息对象(空内容，状态为发送中)
      const botMessage = createBotMessage();

      // 更新消息列表，添加用户消息和初始机器人消息
      setMessages((prev) => [...prev, userMessage, botMessage]);

      // 设置加载状态为true
      setIsLoading(true);

      try {
        // 发送消息到AI服务并处理流式响应
        const cancel = await sendMessageToAI(
          text, // 消息文本
          media, // 媒体内容
          (chunk: string) => {
            // 流式响应回调处理函数
            // 更新机器人消息内容，附加新接收的内容块
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages]; // 创建消息数组的副本
              const lastMessage = updatedMessages[updatedMessages.length - 1]; // 获取最后一条消息

              if (lastMessage && lastMessage.role === MessageRole.Bot) {
                // 如果最后一条消息是机器人消息，则更新它
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage, // 保留原消息的所有属性
                  content: lastMessage.content + chunk, // 附加新的内容块
                  status: MessageStatus.Success, // 更新状态为成功
                };
              }

              return updatedMessages; // 返回更新后的消息数组
            });
          },
          // 响应完成回调
          () => {
            console.log("聊天响应完成，重置加载状态");
            setIsLoading(false); // 重置加载状态
          }
        );

        // 保存取消函数到ref，以便在需要时取消请求
        cancelRequest.current = cancel;
      } catch (err) {
        // 处理错误情况
        setError(err instanceof Error ? err : new Error(String(err)));

        // 更新最后一条消息为错误状态
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];

          if (lastMessage && lastMessage.role === MessageRole.Bot) {
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              status: MessageStatus.Error,
              content: lastMessage.content || "发生错误，请重试",
            };
          }

          return updatedMessages;
        });

        // 重置加载状态
        setIsLoading(false);
      }

      // 注意：不要在这里设置isLoading为false
      // 而是依赖onComplete回调来设置isLoading状态
    },
    [] // 依赖数组为空，表示这个函数不依赖于任何props或state
  );

  /**
   * 清空聊天历史
   * 取消当前请求并清空消息列表
   *
   * useCallback钩子用于记忆函数，防止不必要的重新渲染
   */
  const clearMessages = useCallback(() => {
    // 如果有正在进行的请求，先取消它
    if (cancelRequest.current) {
      cancelRequest.current();
      cancelRequest.current = null;
    }

    // 清空消息列表
    setMessages([]);

    // 重置加载状态
    setIsLoading(false);

    // 清除错误状态
    setError(null);
  }, []); // 依赖数组为空，表示这个函数不依赖于任何props或state

  /**
   * 组件卸载时的清理函数
   *
   * useEffect钩子用于处理副作用
   * 返回的函数会在组件卸载前执行，用于清理资源
   */
  useEffect(() => {
    // 返回清理函数
    return () => {
      // 如果有正在进行的请求，取消它
      if (cancelRequest.current) {
        cancelRequest.current();
      }
    };
  }, []); // 依赖数组为空，表示这个效果只在组件挂载和卸载时执行

  // 返回消息状态和操作函数
  return {
    messages, // 消息列表
    isLoading, // 加载状态
    error, // 错误状态
    sendMessage, // 发送消息函数
    clearMessages, // 清空消息函数
    addMessage, // 添加消息函数
    updateLastMessage, // 更新最后一条消息函数
    deleteMessage, // 删除消息函数
    setIsLoading, // 设置加载状态函数
    setError, // 设置错误状态函数
  };
};
