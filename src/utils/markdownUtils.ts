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
