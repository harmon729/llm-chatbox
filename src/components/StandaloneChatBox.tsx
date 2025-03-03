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

import React from "react";
import OnlineChatBox from "./OnlineChatBox";
import { MessageRole, MessageStatus } from "@/types/chat";

const StandaloneChatBox: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl h-[80vh] bg-white rounded-lg shadow-lg border border-gray-200">
        <OnlineChatBox
          initialMessages={[
            {
              id: "welcome",
              role: MessageRole.Bot,
              content: "欢迎使用独立对话框！请输入您的问题。",
              timestamp: Date.now(),
              status: MessageStatus.Success,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default StandaloneChatBox;
