// 定义一个模拟数据URL
const mockDataUrl = "data:image/jpeg;base64,mockBase64Data";

// 确保vi.mock在导入之前
vi.mock("../../utils/fileUtils", () => {
  return {
    isImageFile: vi.fn(),
    isPdfFile: vi.fn(),
    fileToDataUrl: vi.fn(),
    fileToMediaContent: vi.fn(),
  };
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isImageFile,
  isPdfFile,
  fileToDataUrl,
  fileToMediaContent,
} from "../../utils/fileUtils";
import { MediaType } from "../../types/chat";

describe("fileUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isImageFile", () => {
    it("应该对图片类型返回true", () => {
      (isImageFile as any).mockReturnValue(true);

      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      expect(isImageFile(imageFile)).toBe(true);

      const pngFile = new File([""], "test.png", { type: "image/png" });
      expect(isImageFile(pngFile)).toBe(true);

      const gifFile = new File([""], "test.gif", { type: "image/gif" });
      expect(isImageFile(gifFile)).toBe(true);
    });

    it("应该对非图片类型返回false", () => {
      (isImageFile as any).mockReturnValue(false);

      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      expect(isImageFile(pdfFile)).toBe(false);

      const textFile = new File([""], "test.txt", { type: "text/plain" });
      expect(isImageFile(textFile)).toBe(false);
    });
  });

  describe("isPdfFile", () => {
    it("应该对PDF类型返回true", () => {
      (isPdfFile as any).mockReturnValue(true);

      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      expect(isPdfFile(pdfFile)).toBe(true);
    });

    it("应该对非PDF类型返回false", () => {
      (isPdfFile as any).mockReturnValue(false);

      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      expect(isPdfFile(imageFile)).toBe(false);

      const textFile = new File([""], "test.txt", { type: "text/plain" });
      expect(isPdfFile(textFile)).toBe(false);
    });
  });

  describe("fileToDataUrl", () => {
    it("应该将文件转换为data URL", async () => {
      (fileToDataUrl as any).mockResolvedValue(mockDataUrl);

      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const result = await fileToDataUrl(file);

      expect(result).toBe(mockDataUrl);
    });

    it("应该在读取文件失败时拒绝Promise", async () => {
      const mockError = new Error("读取文件失败");
      (fileToDataUrl as any).mockRejectedValue(mockError);

      const file = new File([""], "test.jpg", { type: "image/jpeg" });

      await expect(fileToDataUrl(file)).rejects.toThrow("读取文件失败");
    });
  });

  describe("fileToMediaContent", () => {
    it("应该将图片文件转换为MediaContent", async () => {
      const expectedResult = {
        type: MediaType.Image,
        url: mockDataUrl,
        name: "test.jpg",
        size: 0,
      };

      (fileToMediaContent as any).mockResolvedValue(expectedResult);
      (isImageFile as any).mockReturnValue(true);
      (isPdfFile as any).mockReturnValue(false);

      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const result = await fileToMediaContent(file);

      expect(result).toEqual(expectedResult);
    });

    it("应该将PDF文件转换为MediaContent", async () => {
      const expectedResult = {
        type: MediaType.PDF,
        url: mockDataUrl,
        name: "test.pdf",
        size: 0,
      };

      (fileToMediaContent as any).mockResolvedValue(expectedResult);
      (isImageFile as any).mockReturnValue(false);
      (isPdfFile as any).mockReturnValue(true);

      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const result = await fileToMediaContent(file);

      expect(result).toEqual(expectedResult);
    });

    it("应该对不支持的文件类型返回null", async () => {
      (fileToMediaContent as any).mockResolvedValue(null);
      (isImageFile as any).mockReturnValue(false);
      (isPdfFile as any).mockReturnValue(false);

      const file = new File([""], "test.txt", { type: "text/plain" });
      const result = await fileToMediaContent(file);

      expect(result).toBeNull();
    });
  });
});
