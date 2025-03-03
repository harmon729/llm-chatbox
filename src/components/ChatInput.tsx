/**
 * ChatInput.tsx
 *
 * 聊天输入组件 - 负责处理用户输入和文件上传
 *
 * 作用：
 * - 提供文本输入框，支持多行输入
 * - 支持图片和PDF文件的上传
 * - 展示已上传的媒体文件预览
 * - 提供发送按钮，并在输入为空或加载状态下禁用
 *
 * 使用场景：
 * - 在InlineChatBox和StandaloneChatBox组件中作为底部输入区域
 * - 任何需要用户输入并与AI交互的界面
 *
 * 修改指南：
 * - 更改输入框样式：修改textarea的className
 * - 添加支持更多文件类型：修改accept属性和handleFileChange函数
 * - 调整输入框高度限制：修改min-h和max-h值以及useEffect中的scrollHeight限制
 *
 * 扩展功能：
 * - 添加语音输入支持
 * - 添加表情选择器
 * - 添加提示词模板
 * - 增加历史记录搜索
 */

"use client";

import * as React from "react";
import { MediaContent } from "@/types/chat";
import { fileToMediaContent, isImageFile, isPdfFile } from "@/utils/fileUtils";

/**
 * 组件接收的属性类型定义
 * TypeScript接口定义了组件的输入属性
 *
 * @property {boolean} isLoading - 是否正在加载中(用于禁用输入)
 * @property {Function} onSendMessage - 发送消息的回调函数，接收文本和媒体文件
 * @property {string} [placeholder] - 输入框占位文本，可选
 * @property {boolean} [initialFocus] - 是否自动聚焦，可选
 * @property {boolean} [minimal] - 是否使用最小化样式(减少内边距)，可选
 * @property {string} [className] - 自定义CSS类名，可选
 */
interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (text: string, media: MediaContent[]) => void;
  placeholder?: string; // ? 表示可选属性
  initialFocus?: boolean; // ? 表示可选属性
  minimal?: boolean; // ? 表示可选属性
  className?: string; // 添加className属性
}

/**
 * 聊天输入组件
 * 提供文本输入和文件上传功能
 *
 * 使用React.FC<T>类型定义函数组件，T为属性类型
 * 结构属性参数，并提供默认值
 */
const ChatInput: React.FC<ChatInputProps> = ({
  isLoading,
  onSendMessage,
  placeholder = "输入您的问题...", // 设置默认值
  initialFocus = false, // 设置默认值
  minimal = false, // 设置默认值
  className, // 获取className属性
}) => {
  // 状态管理
  // useState钩子用于创建和管理组件的状态
  const [inputText, setInputText] = React.useState(""); // 文本输入状态
  const [mediaFiles, setMediaFiles] = React.useState<MediaContent[]>([]); // 媒体文件状态

  // 引用DOM元素
  // useRef钩子创建可变引用，在组件整个生命周期内保持不变
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null); // 文本输入区域引用
  const fileInputRef = React.useRef<HTMLInputElement>(null); // 文件输入框引用

  /**
   * 自动调整文本框高度
   * 根据输入内容的行数自动扩展高度，最大高度为120px
   *
   * useEffect钩子用于处理副作用，例如DOM操作
   * 依赖数组[inputText]表示只有当inputText变化时才执行此效果
   */
  React.useEffect(() => {
    if (textAreaRef.current) {
      // 先重置高度为auto，以便正确计算scrollHeight
      textAreaRef.current.style.height = "auto";
      // 设置高度为scrollHeight，但不超过120px
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputText]);

  /**
   * 初始聚焦处理
   * 如果设置了initialFocus为true，组件挂载后自动聚焦输入框
   *
   * 依赖数组[initialFocus]表示只有当initialFocus变化时才执行此效果
   */
  React.useEffect(() => {
    if (initialFocus && textAreaRef.current) {
      textAreaRef.current.focus(); // 设置聚焦
    }
  }, [initialFocus]);

  /**
   * 处理文本输入变化
   * 更新inputText状态
   *
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 文本输入事件对象
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value); // 更新文本状态为输入框的当前值
  };

  /**
   * 处理按键事件
   * 当用户按下Enter键（非Shift+Enter）且不在加载状态时发送消息
   *
   * @param {KeyboardEvent<HTMLTextAreaElement>} e - 键盘事件对象
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault(); // 阻止默认行为（换行）
      handleSendMessage(); // 调用发送消息函数
    }
  };

  /**
   * 处理文件选择变化
   * 将选择的文件转换为MediaContent对象并添加到状态
   *
   * @param {ChangeEvent<HTMLInputElement>} e - 文件输入事件对象
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 检查是否选择了文件
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    // 筛选有效文件（图片或PDF）
    const files = Array.from(e.target.files);
    // 将文件转换为MediaContent对象
    const mediaPromises = files.map((file) => fileToMediaContent(file as File));
    // 等待所有转换完成
    const mediaContents = await Promise.all(mediaPromises);

    // 过滤掉null值（转换失败的文件）并添加到媒体文件列表
    // 使用类型断言(media is MediaContent)确保TypeScript正确识别过滤后的类型
    const validMedia = mediaContents.filter(
      (media): media is MediaContent => media !== null
    );

    if (validMedia.length > 0) {
      // 更新媒体文件状态，添加新的文件
      setMediaFiles((prev) => [...prev, ...validMedia]);
    }

    // 重置文件输入框，允许重新选择相同的文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * 处理移除媒体文件
   * 从媒体文件列表中删除指定索引的文件
   *
   * @param {number} index - 要删除的文件索引
   */
  const handleRemoveMedia = (index: number) => {
    // 过滤掉指定索引的文件，返回新的媒体文件数组
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 处理发送消息
   * 将文本和媒体文件发送给父组件，并清空输入状态
   *
   * 修改提示：
   * - 添加发送前确认：在此处添加确认逻辑
   * - 添加发送前处理：在此处添加文本处理逻辑
   */
  const handleSendMessage = () => {
    // 去除文本前后的空白字符
    const trimmedText = inputText.trim();

    // 检查是否有内容可发送且不在加载状态
    if ((trimmedText || mediaFiles.length > 0) && !isLoading) {
      // 调用父组件提供的onSendMessage函数
      onSendMessage(trimmedText, mediaFiles);
      // 清空输入文本
      setInputText("");
      // 清空媒体文件列表
      setMediaFiles([]);
    }
  };

  /**
   * 获取发送按钮的样式类
   * 根据输入状态和加载状态返回不同的样式
   *
   * 修改提示：调整此函数可以改变发送按钮的外观
   *
   * @returns {string} 样式类字符串
   */
  const getSendButtonClasses = () => {
    // 基础样式类
    const baseClasses = "rounded-full p-2 focus:ring-2 transition-colors";

    // 判断按钮是否应该禁用
    const isDisabled =
      isLoading || (!inputText.trim() && mediaFiles.length === 0);

    // 返回完整的样式类字符串，根据状态应用不同的样式
    return `${baseClasses} ${
      isDisabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed" // 禁用状态样式
        : "bg-blue-500 text-white hover:bg-blue-600" // 可用状态样式
    }`;
  };

  /**
   * 处理文件按键事件
   * 当按下Enter或空格键时触发文件选择
   *
   * @param {KeyboardEvent<HTMLLabelElement>} e - 键盘事件对象
   */
  const handleFileKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // 阻止默认行为
      fileInputRef.current?.click(); // 触发文件选择对话框
    }
  };

  // 组件渲染结构
  return (
    <div
      className={`flex flex-col w-full ${minimal ? "p-2" : "p-4"} ${
        className || ""
      }`}
    >
      {/* 已上传的媒体文件预览区域 */}
      {mediaFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {mediaFiles.map((media, index) => (
            <div key={index} className="relative">
              {/* 图片预览 */}
              {media.type === "image" && (
                <div className="relative w-20 h-20">
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}

              {/* PDF预览 */}
              {media.type === "pdf" && (
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-md">
                  <span className="text-xs text-center overflow-hidden px-1">
                    {media.name}
                  </span>
                </div>
              )}

              {/* 删除按钮 */}
              <button
                type="button"
                onClick={() => handleRemoveMedia(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                aria-label="删除附件"
                tabIndex={0}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex items-end border rounded-lg bg-white">
        {/* 文本输入框 */}
        <textarea
          ref={textAreaRef}
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 p-2 resize-none border-none focus:ring-0 focus:outline-none rounded-lg min-h-[40px] max-h-[120px]"
          rows={1}
        />

        <div className="flex items-center px-2">
          {/* 文件上传按钮 */}
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            tabIndex={0}
            onKeyDown={handleFileKeyDown}
            aria-label="上传文件"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </svg>
          </label>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />

          {/* 发送按钮 */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={
              isLoading || (!inputText.trim() && mediaFiles.length === 0)
            }
            className={getSendButtonClasses()}
            aria-label="发送消息"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
