/**
 * Message.tsx
 *
 * 消息组件 - 负责渲染对话中的单条消息
 *
 * 作用：
 * - 根据消息类型(用户/机器人)显示不同样式的消息气泡
 * - 支持多种内容类型渲染(文本、Markdown、图片、PDF)
 * - 展示消息状态(加载中、成功、错误)
 *
 * 使用场景：
 * - 在InlineChatBox和StandaloneChatBox组件中用于渲染消息列表
 * - 每条对话记录都会使用此组件进行渲染
 *
 * 修改指南：
 * - 调整样式：修改getMessageContainerClasses和getAvatarContainerClasses函数
 * - 添加新的媒体类型：在renderMedia函数中添加新的case分支
 * - 修改消息头部显示：调整"您"和"AI助手"的显示逻辑
 *
 * 扩展功能：
 * - 添加消息时间戳显示
 * - 添加消息重发功能
 * - 添加消息复制功能
 * - 支持更多媒体类型(如音频、视频)
 */

"use client";

import { useState } from "react";
import {
  MediaContent,
  MediaType,
  Message as MessageType,
  MessageRole,
  MessageStatus,
} from "@/types/chat";
import { splitTextByCodeBlocks } from "@/utils/markdownUtils";
import ReactMarkdown from "react-markdown";

/**
 * 组件接收的属性类型定义
 *
 * @property {MessageType} message - 包含消息的完整数据对象
 */
interface MessageProps {
  message: MessageType;
}

/**
 * 代码块组件
 * 负责渲染和提供复制功能的代码块
 *
 * @param {Object} props - 组件属性
 * @param {string} props.language - 代码语言
 * @param {string} props.code - 代码内容
 */
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  // 使用useState管理复制状态
  const [isCopied, setIsCopied] = useState(false);

  /**
   * 复制代码到剪贴板
   * 设置复制状态为true，2秒后恢复
   */
  const handleCopyCode = () => {
    // 使用navigator.clipboard API复制文本
    navigator.clipboard.writeText(code);
    // 设置复制状态为true
    setIsCopied(true);
    // 2秒后重置状态
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 渲染代码块
  return (
    <div className="relative my-4 rounded-md overflow-hidden bg-gray-800 text-white">
      {/* 语言标记和复制按钮 */}
      <div className="flex justify-between items-center px-4 py-1 bg-gray-700 text-sm">
        <span>{language || "代码"}</span>
        <button
          onClick={handleCopyCode}
          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
          aria-label="复制代码"
          tabIndex={0}
        >
          {isCopied ? "已复制!" : "复制"}
        </button>
      </div>

      {/* 代码内容区域 */}
      <pre className="p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * 媒体预览组件
 * 负责显示图片或PDF文件预览
 *
 * @param {Object} props - 组件属性
 * @param {MediaType} props.type - 媒体类型
 * @param {string} props.url - 媒体文件URL
 * @param {string} props.name - 媒体文件名称
 */
const MediaPreview = ({
  type,
  url,
  name,
}: {
  type: MediaType;
  url: string;
  name: string;
}) => {
  return (
    <div className="mb-2">
      {/* 根据媒体类型显示不同的预览 */}
      {type === MediaType.Image ? (
        // 图片预览
        <img
          src={url}
          alt={name}
          className="max-w-full max-h-96 rounded-md" // 限制最大宽度和高度
          loading="lazy" // 使用懒加载提高性能
        />
      ) : type === MediaType.PDF ? (
        // PDF文件预览
        <div className="flex items-center bg-gray-100 p-2 rounded-md">
          {/* PDF图标 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-red-500 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          {/* PDF下载链接 */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            {name}
          </a>
        </div>
      ) : null}
    </div>
  );
};

/**
 * 消息组件
 * 根据消息类型和状态渲染不同样式的消息气泡
 *
 * @param {Object} props - 组件属性
 * @param {MessageType} props.message - 消息对象
 */
const Message: React.FC<MessageProps> = ({ message }) => {
  // 从消息对象中解构属性
  const { role, content, media, status } = message;

  // 生成消息容器类，根据角色调整对齐方式
  const containerClasses = `py-4 flex ${
    role === MessageRole.User ? "justify-end" : "justify-start"
  }`;

  // 生成消息气泡样式，根据角色应用不同的颜色和形状
  const bubbleClasses = `max-w-[85%] px-4 py-3 rounded-lg ${
    role === MessageRole.User
      ? "bg-blue-500 text-white rounded-tr-none" // 用户消息样式
      : "bg-gray-100 text-gray-800 rounded-tl-none" // 机器人消息样式
  }`;

  // 处理加载中状态 - 显示动画加载点
  if (role === MessageRole.Bot && status === MessageStatus.Sending) {
    return (
      <div className={containerClasses}>
        <div className={bubbleClasses}>
          <div className="flex items-center">
            {/* 三个加载动画点 */}
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mx-1"
              style={{ animationDelay: "0.2s" }} // 错开动画时间
            ></div>
            <div
              className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }} // 错开动画时间
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // 处理错误状态 - 显示错误消息和重试按钮
  if (status === MessageStatus.Error) {
    return (
      <div className={containerClasses}>
        <div className="max-w-[85%] px-4 py-3 bg-red-100 text-red-800 rounded-lg">
          <p className="text-sm">发送失败: {content || "未知错误"}</p>
          <button
            className="text-xs mt-1 text-red-600 underline"
            aria-label="重试"
            tabIndex={0}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 处理正常消息内容
  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {/* 媒体内容部分 - 如果存在媒体内容则渲染 */}
        {media && media.length > 0 && (
          <div className="mb-2">
            {media.map((item, index) => (
              <MediaPreview
                key={index}
                type={item.type}
                url={item.url}
                name={item.name}
              />
            ))}
          </div>
        )}

        {/* 文本内容部分 */}
        {role === MessageRole.User ? (
          // 用户消息 - 纯文本显示
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          // 机器人消息 - 支持Markdown和代码块
          <div className="prose max-w-none prose-sm dark:prose-invert">
            {/* 分割并处理文本和代码块 */}
            {splitTextByCodeBlocks(content).map((part, index) => (
              <div key={index}>
                {part.type === "text" ? (
                  // 渲染普通文本，使用ReactMarkdown支持Markdown语法
                  <ReactMarkdown>{part.content}</ReactMarkdown>
                ) : (
                  // 渲染代码块，使用CodeBlock组件
                  <CodeBlock
                    language={part.language || ""}
                    code={part.content}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
