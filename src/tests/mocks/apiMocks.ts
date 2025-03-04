import { vi } from "vitest";

// 模拟API服务中的函数
export const setupApiServiceMocks = () => {
  vi.mock("../../services/apiService", () => ({
    sendMessageToAPI: vi.fn((message, media, onChunk, onComplete) => {
      // 模拟流式响应
      if (onChunk) {
        setTimeout(() => onChunk("AI响应"), 10);
      }

      // 模拟完成回调
      if (onComplete) {
        setTimeout(() => onComplete(), 20);
      }

      // 返回取消函数
      return () => {};
    }),
    sendMessageToAI: vi.fn((message, options) => {
      // 返回模拟Promise
      return Promise.resolve("AI响应");
    }),
  }));
};

// 恢复原始实现
export const restoreApiServiceMocks = () => {
  vi.resetModules();
  vi.clearAllMocks();
};
