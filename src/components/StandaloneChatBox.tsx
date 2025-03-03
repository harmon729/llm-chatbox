/**
 * StandaloneChatBox.tsx
 * 独立聊天框组件 - 提供全页面聊天界面
 *
 * 作用：
 * - 提供全屏聊天体验
 * - 管理与LLM的对话状态和流式响应
 * - 展示消息历史记录
 * - 提供消息输入和发送功能
 * - 支持多种媒体格式
 *
 * 使用场景：
 * - 作为主要交互界面，而非辅助功能
 * - 需要专注于对话的场景
 * - 需要更大空间展示复杂内容的场景
 */

"use client";

import { useRef, useEffect } from "react";
import { Message as MessageType, MediaContent } from "@/types/chat";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatInput from "./ChatInput";
import Message from "@/components/Message";

/**
 * 独立聊天框组件
 * 提供全页面聊天界面
 *
 * @returns {JSX.Element} 渲染的组件
 */
const StandaloneChatBox: React.FC = () => {
  // 使用自定义钩子管理聊天消息状态和操作
  const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();

  // 创建消息列表底部的引用，用于自动滚动功能
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 滚动到消息列表底部
   * 用于每次新消息到达时保持视图在最新消息上
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * 监听消息列表变化，自动滚动到底部
   *
   * useEffect钩子用于处理副作用，这里用于在消息更新后滚动到底部
   * 依赖数组[messages]表示只有当messages变化时才执行此效果
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">AI 助手对话</h1>

        {/* 清空对话按钮 - 仅在有消息时显示 */}
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
            aria-label="清空对话"
            tabIndex={0}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              清空对话
            </div>
          </button>
        )}
      </header>

      {/* 主体内容区域 - 消息列表 */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* 欢迎消息 - 仅在无消息时显示 */}
          {messages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">欢迎使用AI助手</h2>
              <p className="text-gray-600 mb-6">
                您可以开始向AI提问，支持发送文本、图片和PDF文件。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-medium mb-1">示例问题</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 解释量子计算的基本原理</li>
                    <li>• 帮我写一个简单的React组件</li>
                    <li>• 如何制作意大利面？</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-medium mb-1">功能介绍</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 支持Markdown格式</li>
                    <li>• 可上传图片和PDF文件</li>
                    <li>• 代码高亮显示</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // 消息列表 - 循环渲染所有消息
            <div className="space-y-4">
              {messages.map((msg: MessageType) => (
                <Message key={msg.id} message={msg} />
              ))}
              {/* 消息列表底部标记，用于自动滚动 */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* 底部输入区域 - 固定在页面底部 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            isLoading={isLoading}
            onSendMessage={sendMessage}
            initialFocus={true} // 自动聚焦输入框
            placeholder="输入您的问题..."
          />
        </div>
      </footer>
    </div>
  );
};

export default StandaloneChatBox;
