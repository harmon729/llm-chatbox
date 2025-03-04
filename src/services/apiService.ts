/**
 * apiService.ts
 * 统一的API服务 - 处理与AI模型的通信
 */

import { MediaContent } from "@/types/chat";
import { sendStreamMessageWithCozeSdk } from "./cozeSdkService";

// 环境变量定义的API端点和密钥
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// 请求头设置
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// 错误消息
const ERROR_MESSAGES = {
  NETWORK: "网络连接失败，请检查您的网络连接。",
  SERVER: "服务器处理请求失败，请稍后重试。",
  GENERAL: "发送消息时出现错误，请稍后重试。",
  STREAM: "流式响应中断，请刷新页面重试。",
};

/**
 * 获取用户唯一标识ID
 * 从localStorage获取或创建一个新的
 *
 * @returns 用户唯一ID
 */
export const getUserId = (): string => {
  // 检查浏览器环境
  if (typeof window === "undefined") {
    return "server-side-user";
  }

  // 尝试从localStorage获取用户ID
  let userId = localStorage.getItem("userId");

  // 如果不存在，创建一个新的UUID并保存
  if (!userId) {
    userId = crypto.randomUUID
      ? crypto.randomUUID()
      : `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("userId", userId);
  }

  return userId;
};

/**
 * 发送消息到AI模型并获取流式响应
 *
 * @param message 用户消息内容
 * @param media 媒体内容数组
 * @param onChunk 接收数据块的回调函数
 * @param onComplete 响应完成的回调函数
 * @returns 清理函数，用于中断请求
 */
export const sendMessageToAI = async (
  message: string,
  media: MediaContent[] = [],
  onChunk: (chunk: string) => void,
  onComplete?: () => void
): Promise<() => void> => {
  // 使用API服务发送消息，而不是直接调用SDK
  return sendMessageToAPI(message, media, onChunk, onComplete || (() => {}));
};

/**
 * 发送消息到API
 *
 * @param text 消息文本内容
 * @param media 可选的媒体内容
 * @param onChunk 处理流式响应的回调函数
 * @param onComplete 响应完成的回调函数
 * @returns 取消请求的函数
 */
export const sendMessageToAPI = async (
  text: string,
  media: MediaContent[] = [],
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<() => void> => {
  // 创建AbortController用于取消请求
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    // 构建请求内容
    const requestBody = {
      message: text,
      media: media,
      userId: getUserId(),
      stream: true, // 启用流式响应
    };

    // 发送POST请求到API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: signal, // 传递信号用于取消请求
    });

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API请求失败");
    }

    // 处理流式响应
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 处理数据流
      const processStreamChunks = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log("流式响应已完成");
              onComplete();
              break;
            }

            // 解码并处理响应数据
            const text = decoder.decode(value, { stream: true });
            onChunk(text);
          }
        } catch (error) {
          console.error("处理流式响应时出错:", error);
          onComplete();
        }
      };

      // 开始处理流
      processStreamChunks();
    } else {
      console.warn("响应没有可读流");
      onComplete();
    }

    // 返回取消函数
    return () => {
      console.log("取消请求");
      controller.abort();
    };
  } catch (error) {
    // 如果错误是由取消操作引起的，则静默处理
    if (error instanceof Error && error.name === "AbortError") {
      console.log("请求已被取消");
    } else {
      // 否则记录错误并重新抛出
      console.error("API请求出错:", error);
      throw error;
    }
    // 完成回调
    onComplete();
    // 返回空的取消函数
    return () => {};
  }
};
