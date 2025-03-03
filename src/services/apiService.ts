/**
 * apiService.ts
 * 统一的API服务 - 处理与AI模型的通信
 */

import { MediaContent } from "@/types/chat";
import { sendMessageToCoze } from "./cozeService";

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
  // 使用Coze服务发送消息
  return sendMessageToCoze(message, media, onChunk, onComplete);
};

/**
 * 发送消息到API并返回响应文本
 * 这是一个简化版函数，用于OnlineChatBox组件测试
 *
 * @param {string} message - 要发送的消息内容
 * @returns {Promise<string>} 返回API响应内容
 */
export const sendMessageToAPI = async (message: string): Promise<string> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 简单的响应逻辑用于测试
  return `这是对"${message}"的回复`;
};
