/**
 * InlineChatBox.tsx
 *
 * 内联聊天框组件 - 提供可折叠的内嵌式对话界面
 *
 * 作用：
 * - 提供可折叠/展开的内联聊天界面
 * - 管理与LLM的对话状态和流式响应
 * - 处理消息的发送和接收
 * - 提供清空对话功能
 *
 * 使用场景：
 * - 在网页中嵌入一个可折叠的AI助手对话框
 * - 作为页面辅助功能而不占据主要空间
 * - 需要快速获取AI帮助但不跳转页面的场景
 *
 * 修改指南：
 * - 调整外观：修改对应DOM元素的className
 * - 修改对话框尺寸：调整style中的height值
 * - 添加更多功能按钮：在头部区域添加新的按钮
 * - 更改折叠/展开行为：修改handleInputClick和handleClose函数
 *
 * 扩展功能：
 * - 添加拖拽调整大小功能
 * - 添加对话历史保存和加载
 * - 添加快捷指令/提示词功能
 * - 添加用户设置(字体大小、主题等)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChatBoxState,
  Message as MessageType,
  MediaContent,
} from "@/types/chat";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatInput from "./ChatInput";
import Message from "./Message";

/**
 * 内联聊天框组件
 * 提供可折叠的内嵌式对话界面
 *
 * @returns {JSX.Element} 渲染的组件
 */
const InlineChatBox: React.FC = () => {
  // 使用状态管理聊天框的当前状态(折叠/展开/对话)
  const [chatState, setChatState] = useState<ChatBoxState>(
    ChatBoxState.Collapsed // 初始状态为折叠
  );

  // 使用自定义钩子管理聊天消息
  const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();

  // 创建引用
  const messagesEndRef = useRef<HTMLDivElement>(null); // 消息列表底部引用，用于滚动
  const chatBoxRef = useRef<HTMLDivElement>(null); // 聊天框引用，用于检测点击外部

  /**
   * 滚动到消息列表底部
   * 用于每次新消息到达时保持视图在最新消息上
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * 消息更新时滚动到底部
   *
   * useEffect钩子用于处理副作用，这里用于在消息更新后滚动到底部
   * 依赖数组[messages]表示只有当messages变化时才执行此效果
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 点击外部时折叠聊天框
   *
   * 添加全局点击事件监听器，检测点击是否发生在聊天框外部
   * 依赖数组[chatState]表示只有当chatState变化时才重新设置监听器
   */
  useEffect(() => {
    /**
     * 处理外部点击事件
     *
     * @param {MouseEvent} event - 鼠标事件对象
     */
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击是否在聊天框外部且聊天框处于展开状态
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target as Node) &&
        chatState === ChatBoxState.Expanded
      ) {
        setChatState(ChatBoxState.Collapsed); // 折叠聊天框
      }
    };

    // 添加点击事件监听器
    document.addEventListener("mousedown", handleClickOutside);

    // 返回清理函数，组件卸载时移除监听器
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatState]);

  /**
   * 处理发送消息
   * 调用useChatMessages钩子中的sendMessage函数并更新状态
   *
   * @param {string} text - 消息文本
   * @param {MediaContent[]} media - 媒体文件数组
   */
  const handleSendMessage = (text: string, media: MediaContent[]) => {
    sendMessage(text, media); // 发送消息

    // 如果在折叠状态下发送消息，则切换到展开状态
    if (chatState === ChatBoxState.Collapsed) {
      setChatState(ChatBoxState.Expanded);
    }
  };

  /**
   * 处理输入框点击
   * 点击折叠状态的输入框时，切换到展开状态
   */
  const handleInputClick = () => {
    if (chatState === ChatBoxState.Collapsed) {
      setChatState(ChatBoxState.Expanded); // 展开聊天框
    }
  };

  /**
   * 处理关闭按钮点击
   * 关闭/折叠聊天框
   */
  const handleClose = () => {
    setChatState(ChatBoxState.Collapsed); // 折叠聊天框
  };

  /**
   * 处理清空对话
   * 清空消息历史并保持聊天框展开
   */
  const handleClearChat = () => {
    clearMessages(); // 清空消息
    setChatState(ChatBoxState.Expanded); // 保持展开状态
  };

  /**
   * 输入框键盘事件处理
   * 支持按Esc键关闭聊天框
   *
   * @param {React.KeyboardEvent} e - 键盘事件对象
   */
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose(); // 关闭聊天框
    }
  };

  /**
   * 渲染聊天框标题
   * 包含标题文本和操作按钮
   *
   * @returns {JSX.Element} 渲染的标题栏
   */
  const renderChatTitle = () => {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
        <h3 className="font-medium">AI助手</h3>
        <div className="flex space-x-2">
          {/* 清空按钮 - 仅在有消息时显示 */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-gray-500 hover:text-gray-700"
              aria-label="清空对话"
              tabIndex={0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </button>
          )}

          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="关闭对话框"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // 根据当前状态渲染不同的聊天框内容
  // 折叠状态 - 仅显示输入框
  if (chatState === ChatBoxState.Collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50" onClick={handleInputClick}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 cursor-pointer w-72">
          <ChatInput
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            placeholder="问点什么..."
            initialFocus={false}
            minimal={true} // 使用最小化样式
          />
        </div>
      </div>
    );
  }

  // 展开状态 - 显示完整聊天框
  return (
    <div
      ref={chatBoxRef}
      className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col w-80 md:w-96"
      style={{ maxHeight: "80vh" }} // 限制最大高度
    >
      {/* 聊天框标题 */}
      {renderChatTitle()}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: "50vh" }}>
        {messages.length === 0 ? (
          // 无消息时显示引导文本
          <div className="text-center text-gray-500 my-8">
            <p>有什么可以帮助您的？</p>
          </div>
        ) : (
          // 有消息时循环渲染消息列表
          messages.map((msg: MessageType) => (
            <Message key={msg.id} message={msg} />
          ))
        )}
        {/* 消息列表底部标记，用于自动滚动 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <ChatInput
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        initialFocus={chatState === ChatBoxState.Expanded} // 展开状态下自动聚焦
        placeholder="输入您的问题..."
      />
    </div>
  );
};

export default InlineChatBox;
