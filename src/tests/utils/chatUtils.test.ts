import { describe, it, expect, vi } from "vitest";
import {
  generateId,
  createUserMessage,
  createBotMessage,
  isImageFile,
  isPdfFile,
  isCodeBlock,
  getLanguageFromCodeBlock,
} from "@/utils/chatUtils";
import { MessageRole, MessageStatus, MediaType } from "@/types/chat";

describe("聊天工具函数", () => {
  describe("generateId", () => {
    it("应生成非空字符串ID", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("应生成唯一ID", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("createUserMessage", () => {
    it("应创建正确的用户消息对象", () => {
      const content = "测试消息";
      const message = createUserMessage(content);

      expect(message.role).toBe(MessageRole.User);
      expect(message.content).toBe(content);
      expect(message.status).toBe(MessageStatus.Success);
      expect(typeof message.id).toBe("string");
      expect(typeof message.timestamp).toBe("number");
    });

    it("应支持添加媒体内容", () => {
      const content = "测试消息";
      const media = [{ type: MediaType.Image, data: "test-data" }];
      const message = createUserMessage(content, media);

      expect(message.media).toBe(media);
    });
  });

  describe("createBotMessage", () => {
    it("应创建正确的机器人消息对象", () => {
      const message = createBotMessage();

      expect(message.role).toBe(MessageRole.Bot);
      expect(message.content).toBe("");
      expect(message.status).toBe(MessageStatus.Sending);
      expect(typeof message.id).toBe("string");
      expect(typeof message.timestamp).toBe("number");
    });

    it("应支持自定义内容和状态", () => {
      const content = "测试回复";
      const status = MessageStatus.Success;
      const message = createBotMessage(content, status);

      expect(message.content).toBe(content);
      expect(message.status).toBe(status);
    });
  });

  describe("文件类型检查", () => {
    it("应正确识别图片文件", () => {
      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      const textFile = new File([""], "test.txt", { type: "text/plain" });

      expect(isImageFile(imageFile)).toBe(true);
      expect(isImageFile(pdfFile)).toBe(false);
      expect(isImageFile(textFile)).toBe(false);
    });

    it("应正确识别PDF文件", () => {
      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      const textFile = new File([""], "test.txt", { type: "text/plain" });

      expect(isPdfFile(imageFile)).toBe(false);
      expect(isPdfFile(pdfFile)).toBe(true);
      expect(isPdfFile(textFile)).toBe(false);
    });
  });

  describe("代码块处理", () => {
    it("应正确识别代码块", () => {
      const codeBlock = "```javascript\nconst x = 1;\n```";
      const notCodeBlock = "const x = 1;";
      const emptyCodeBlock = "```\n```";

      expect(isCodeBlock(codeBlock)).toBe(true);
      expect(isCodeBlock(notCodeBlock)).toBe(false);
      expect(isCodeBlock(emptyCodeBlock)).toBe(true);
    });

    it("应正确提取代码块语言", () => {
      expect(getLanguageFromCodeBlock("```javascript\nconst x = 1;\n```")).toBe(
        "javascript"
      );
      expect(getLanguageFromCodeBlock('```python\nprint("Hello")\n```')).toBe(
        "python"
      );
      expect(getLanguageFromCodeBlock("```\nNo language\n```")).toBe("");
    });
  });
});
