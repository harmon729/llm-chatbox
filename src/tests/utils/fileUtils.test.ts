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
      // 创建不同图片类型的文件对象
      const jpegFile = new File([""], "test.jpg", { type: "image/jpeg" });
      const pngFile = new File([""], "test.png", { type: "image/png" });
      const gifFile = new File([""], "test.gif", { type: "image/gif" });
      const webpFile = new File([""], "test.webp", { type: "image/webp" });

      // 验证所有图片类型都返回true
      expect(isImageFile(jpegFile)).toBe(true);
      expect(isImageFile(pngFile)).toBe(true);
      expect(isImageFile(gifFile)).toBe(true);
      expect(isImageFile(webpFile)).toBe(true);
    });

    it("应该对非图片类型返回false", () => {
      // 创建非图片类型的文件对象
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      const textFile = new File([""], "test.txt", { type: "text/plain" });
      const docFile = new File([""], "test.doc", {
        type: "application/msword",
      });

      // 验证所有非图片类型都返回false
      expect(isImageFile(pdfFile)).toBe(false);
      expect(isImageFile(textFile)).toBe(false);
      expect(isImageFile(docFile)).toBe(false);
    });

    it("应该对空类型返回false", () => {
      const emptyFile = new File([""], "empty", { type: "" });
      expect(isImageFile(emptyFile)).toBe(false);
    });
  });

  describe("isPdfFile", () => {
    it("应该对PDF类型返回true", () => {
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      expect(isPdfFile(pdfFile)).toBe(true);
    });

    it("应该对非PDF类型返回false", () => {
      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      const textFile = new File([""], "test.txt", { type: "text/plain" });
      const docFile = new File([""], "test.doc", {
        type: "application/msword",
      });

      expect(isPdfFile(imageFile)).toBe(false);
      expect(isPdfFile(textFile)).toBe(false);
      expect(isPdfFile(docFile)).toBe(false);
    });

    it("应该对类似但不完全匹配PDF类型的MIME类型返回false", () => {
      const notQuitePdf = new File([""], "test.pdf", {
        type: "application/pdf+xml",
      });
      expect(isPdfFile(notQuitePdf)).toBe(false);
    });
  });

  describe("fileToDataUrl", () => {
    it("应该正确转换文件为dataURL", async () => {
      // 模拟FileReader行为
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          // 调用readAsDataURL后异步触发onload
          setTimeout(() => {
            this.result = "data:image/jpeg;base64,mockbase64data";
            this.onload();
          }, 0);
        }),
        result: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建测试文件
      const file = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      // 测试fileToDataUrl函数
      const result = await fileToDataUrl(file);

      // 验证结果
      expect(result).toBe("data:image/jpeg;base64,mockbase64data");
      expect(mockFileReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);

      // 恢复原始FileReader
      global.FileReader = originalFileReader;
    });

    it("应该在FileReader错误时拒绝Promise", async () => {
      // 模拟FileReader错误行为
      const mockError = new Error("读取文件失败");
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          // 调用readAsDataURL后异步触发onerror
          setTimeout(() => {
            this.error = mockError;
            this.onerror();
          }, 0);
        }),
        error: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建测试文件
      const file = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      // 验证fileToDataUrl函数在出错时会拒绝Promise
      await expect(fileToDataUrl(file)).rejects.toEqual(mockError);

      // 恢复原始FileReader
      global.FileReader = originalFileReader;
    });

    it("应该在非字符串结果时拒绝Promise", async () => {
      // 模拟FileReader返回非字符串结果的行为
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          setTimeout(() => {
            this.result = new ArrayBuffer(8); // 非字符串结果
            this.onload();
          }, 0);
        }),
        result: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建测试文件
      const file = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      // 验证fileToDataUrl函数在结果不是字符串时会拒绝Promise
      await expect(fileToDataUrl(file)).rejects.toThrow(
        "FileReader 结果不是字符串"
      );

      // 恢复原始FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe("fileToMediaContent", () => {
    // 在测试前保存原始FileReader和console.error
    let originalFileReader: typeof FileReader;
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
      originalFileReader = global.FileReader;
      originalConsoleError = console.error;
      console.error = vi.fn(); // 静默错误日志
    });

    afterEach(() => {
      global.FileReader = originalFileReader;
      console.error = originalConsoleError;
    });

    it("应该将图片文件转换为Image类型的MediaContent", async () => {
      // 模拟FileReader成功读取图片
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          setTimeout(() => {
            this.result = "data:image/jpeg;base64,mockimagedata";
            this.onload();
          }, 0);
        }),
        result: null,
      };

      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建图片文件
      const imageFile = new File(["image content"], "photo.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      Object.defineProperty(imageFile, "size", { value: 12345 });

      // 测试fileToMediaContent函数
      const result = await fileToMediaContent(imageFile);

      // 验证结果
      expect(result).toEqual({
        type: MediaType.Image,
        url: "data:image/jpeg;base64,mockimagedata",
        name: "photo.jpg",
        size: 12345,
      });
    });

    it("应该将PDF文件转换为PDF类型的MediaContent", async () => {
      // 模拟FileReader成功读取PDF
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          setTimeout(() => {
            this.result = "data:application/pdf;base64,mockpdfdata";
            this.onload();
          }, 0);
        }),
        result: null,
      };

      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建PDF文件
      const pdfFile = new File(["pdf content"], "document.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      Object.defineProperty(pdfFile, "size", { value: 54321 });

      // 测试fileToMediaContent函数
      const result = await fileToMediaContent(pdfFile);

      // 验证结果
      expect(result).toEqual({
        type: MediaType.PDF,
        url: "data:application/pdf;base64,mockpdfdata",
        name: "document.pdf",
        size: 54321,
      });
    });

    it("应该对不支持的文件类型返回null", async () => {
      // 创建不支持的文件类型
      const txtFile = new File(["text content"], "notes.txt", {
        type: "text/plain",
      });

      // 测试fileToMediaContent函数
      const result = await fileToMediaContent(txtFile);

      // 验证结果
      expect(result).toBeNull();
    });

    it("应该在文件转换过程中出错时返回null并记录错误", async () => {
      // 模拟FileReader失败
      const mockError = new Error("读取文件失败");
      const mockFileReaderInstance = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: vi.fn().mockImplementation(function () {
          setTimeout(() => {
            this.error = mockError;
            this.onerror();
          }, 0);
        }),
        error: null,
      };

      global.FileReader = vi.fn(() => mockFileReaderInstance) as any;

      // 创建测试文件
      const imageFile = new File(["image data"], "broken.jpg", {
        type: "image/jpeg",
      });

      // 测试fileToMediaContent函数
      const result = await fileToMediaContent(imageFile);

      // 验证结果
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith("文件转换错误:", mockError);
    });
  });
});
