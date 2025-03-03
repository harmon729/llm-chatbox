import {
  Message,
  MessageRole,
  MessageStatus,
  MediaContent,
  MediaType,
} from "@/types/chat";

/**
 * 生成唯一ID
 * @returns 唯一字符串ID
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * 创建用户消息对象
 * @param content 消息内容
 * @param media 可选的媒体内容
 * @returns 用户消息对象
 */
export const createUserMessage = (
  content: string,
  media?: MediaContent[]
): Message => {
  return {
    id: generateId(),
    role: MessageRole.User,
    content,
    status: MessageStatus.Success,
    timestamp: Date.now(),
    ...(media && { media }),
  };
};

/**
 * 创建机器人消息对象
 * @param content 可选的消息内容
 * @param status 可选的消息状态
 * @returns 机器人消息对象
 */
export const createBotMessage = (
  content: string = "",
  status: MessageStatus = MessageStatus.Sending
): Message => {
  return {
    id: generateId(),
    role: MessageRole.Bot,
    content,
    status,
    timestamp: Date.now(),
  };
};

/**
 * 检查文件是否为图片
 * @param file 待检查的文件
 * @returns 是否为图片文件
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * 检查文件是否为PDF
 * @param file 待检查的文件
 * @returns 是否为PDF文件
 */
export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

/**
 * 检查字符串是否为代码块
 * @param text 待检查的文本
 * @returns 是否为代码块
 */
export const isCodeBlock = (text: string): boolean => {
  return /^```[\s\S]*```$/.test(text);
};

/**
 * 从代码块中提取语言
 * @param codeBlock 代码块文本
 * @returns 代码块指定的语言，如果没有则返回空字符串
 */
export const getLanguageFromCodeBlock = (codeBlock: string): string => {
  const match = codeBlock.match(/^```(\w*)/);
  return match && match[1] ? match[1] : "";
};
