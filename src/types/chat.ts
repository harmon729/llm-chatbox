/**
 * chat.ts
 * 聊天相关类型定义文件
 * 本文件定义了整个聊天系统中使用的所有TypeScript类型、接口和枚举
 */

// 消息角色枚举 - 定义消息的发送者类型
// enum关键字用于创建命名常量组，提供更好的类型安全和可读性
export enum MessageRole {
  User = "user", // 用户发送的消息
  Bot = "bot", // AI助手(机器人)发送的消息
}

// 消息状态枚举 - 定义消息的当前处理状态
export enum MessageStatus {
  Sending = "sending", // 消息正在发送中
  Success = "success", // 消息发送成功
  Error = "error", // 消息发送失败
}

// 媒体类型枚举 - 定义支持的媒体文件类型
export enum MediaType {
  Image = "image", // 图片类型
  PDF = "pdf", // PDF文档类型
}

// 聊天框状态枚举 - 定义内联聊天框的显示状态
export enum ChatBoxState {
  Collapsed = "collapsed", // 折叠状态 - 仅显示输入框
  Expanded = "expanded", // 展开状态 - 显示对话框但无消息
  Chatting = "chatting", // 对话状态 - 展示完整对话
}

// 媒体内容接口 - 定义上传的媒体文件属性
// interface关键字用于定义对象的结构和类型
export interface MediaContent {
  type: MediaType; // 媒体类型，使用MediaType枚举
  url: string; // 媒体文件URL或数据URL
  name: string; // 文件名称
  size: number; // 文件大小(字节)
}

// 消息接口 - 定义单条消息的完整结构
export interface Message {
  id: string; // 唯一标识符
  role: MessageRole; // 发送者角色，使用MessageRole枚举
  content: string; // 消息文本内容
  media?: MediaContent[]; // 可选的媒体内容数组，?表示可选属性
  status: MessageStatus; // 消息状态，使用MessageStatus枚举
  timestamp: number; // 时间戳，记录消息创建时间
}

// 聊天状态接口 - 定义整个聊天状态的结构
export interface ChatState {
  messages: Message[]; // 消息数组，包含所有对话消息
  isLoading: boolean; // 加载状态标志
  error: string | null; // 错误信息，如果有的话
}

// LLM API响应格式接口 - 定义AI服务返回的数据结构
export interface LLMResponse {
  content?: string; // 响应内容，?表示可选属性
  done?: boolean; // 是否完成标志
  id?: string; // 响应ID
  conversation_id?: string; // 对话ID
  bot_id?: string; // 机器人ID
  created_at?: number; // 创建时间戳
  failed_at?: number; // 失败时间戳，如果失败的话
  status?: string; // 响应状态
  choices?: Array<{
    delta?: {
      content?: string;
    };
    index?: number;
    finish_reason?: string | null;
  }>; // 流式响应中的选择，与OpenAI格式兼容
  last_error?: {
    // 最后的错误信息
    code: number; // 错误代码
    msg: string; // 错误消息
  };
  usage?: {
    // 使用统计
    token_count: number; // token总数
    output_count: number; // 输出token数
    input_count: number; // 输入token数
  };
  section_id?: string; // 分段ID
}
