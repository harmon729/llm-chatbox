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

import React from "react";
import OnlineChatBox from "./OnlineChatBox";

const InlineChatBox: React.FC = () => {
  return (
    <div className="inline-chat-box">
      <OnlineChatBox initialMessages={[]} />
    </div>
  );
};

export default InlineChatBox;
