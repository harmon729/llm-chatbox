/**
 * markdownUtils.ts
 * Markdown处理工具函数集
 */

/**
 * 检查文本是否包含代码块
 */
export const isCodeBlock = (text: string): boolean => {
  return /```[\s\S]*?```/.test(text);
};

/**
 * 从代码块中提取语言
 */
export const getLanguageFromCodeBlock = (codeBlock: string): string => {
  const match = codeBlock.match(/```(\w*)\n/);
  return match && match[1] ? match[1].toLowerCase() : "";
};

/**
 * 提取代码块内容(不包含反引号和语言标记)
 */
export const extractCodeContent = (codeBlock: string): string => {
  const lines = codeBlock.split("\n");
  // 移除第一行和最后一行的```
  return lines.slice(1, lines.length - 1).join("\n");
};

/**
 * 分割文本为代码块和非代码块部分
 */
export const splitTextByCodeBlocks = (
  text: string
): Array<{
  type: "text" | "code";
  content: string;
  language?: string;
}> => {
  const parts: Array<{
    type: "text" | "code";
    content: string;
    language?: string;
  }> = [];

  // 匹配所有代码块，包括语言标识符
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  // 遍历所有代码块匹配
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // 添加代码块前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }

    // 添加代码块
    parts.push({
      type: "code",
      content: match[2], // 代码内容
      language: match[1] || "plaintext", // 语言标识符
    });

    lastIndex = match.index + match[0].length;
  }

  // 添加最后一个代码块后的文本
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  return parts;
};

/**
 * 检测文本是否包含Markdown语法
 *
 * @param {string} text - 要检查的文本内容
 * @returns {boolean} 如果包含Markdown语法则返回true，否则返回false
 */
export const containsMarkdown = (text: string): boolean => {
  if (!text || text.trim() === "") return false;

  // 检测常见的Markdown语法特征
  const markdownPatterns = [
    /^#{1,6}\s+/m, // 标题
    /(\*\*|__).+?(\*\*|__)/, // 粗体
    /(\*|_).+?(\*|_)/, // 斜体
    /`{1,3}[\s\S]*?`{1,3}/, // 行内代码和代码块
    /\[.+?\]\(.+?\)/, // 链接
    /!\[.+?\]\(.+?\)/, // 图片
    /^[-*+]\s+/m, // 无序列表
    /^\d+\.\s+/m, // 有序列表
    /^>\s+/m, // 引用
    /\|(.+?\|)+/m, // 表格
    /~~.+?~~/, // 删除线
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
};

/**
 * 从Markdown文本中提取纯文本内容
 *
 * @param {string} markdown - 包含Markdown语法的文本
 * @returns {string} 去除Markdown语法后的纯文本
 */
export const extractTextFromMarkdown = (markdown: string): string => {
  if (!markdown) return "";

  // 1. 移除代码块及其内容
  let text = markdown.replace(/```[\s\S]*?```/g, "");

  // 2. 提取图片alt文本，但保留链接文本
  text = text
    .replace(/!\[(.+?)\]\(.+?\)/g, "") // 移除图片，不保留alt文本
    .replace(/\[(.+?)\]\(.+?\)/g, "$1"); // 保留链接文本

  // 3. 移除各类Markdown标记，但保留内容
  text = text
    .replace(/^#{1,6}\s+(.+)$/gm, "$1") // 标题
    .replace(/(\*\*|__)(.*?)(\*\*|__)/g, "$2") // 粗体
    .replace(/(\*|_)(.*?)(\*|_)/g, "$2") // 斜体
    .replace(/~~(.*?)~~/g, "$1") // 删除线
    .replace(/`([^`]+)`/g, "$1") // 行内代码
    .replace(/^\s*>\s+(.*)$/gm, "$1") // 引用
    .replace(/^\s*[-*+]\s+(.*)$/gm, "$1") // 无序列表
    .replace(/^\s*\d+\.\s+(.*)$/gm, "$1"); // 有序列表

  // 4. 简单处理表格：保留单元格内容，用空格分隔
  text = text.replace(/\|([^|]+)\|/g, "$1 ");

  // 5. 清理多余空白字符
  text = text.replace(/\s+/g, " ").trim();

  return text;
};
