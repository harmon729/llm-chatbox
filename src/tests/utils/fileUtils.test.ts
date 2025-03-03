// 定义一个模拟数据URL
const mockDataUrl = "data:image/jpeg;base64,mockBase64Data";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isImageFile,
  isPdfFile,
  fileToDataUrl,
  fileToMediaContent,
} from "../../utils/fileUtils";
import { MediaType } from "../../types/chat";

// 添加FileReader类型定义
interface MockFileReader {
  onload: ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any) | null;
  onerror:
    | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
    | null;
  readAsDataURL: (blob: Blob) => void;
  result: string | ArrayBuffer | null;
  error?: Error | null;
}

describe("fileUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isImageFile", () => {
    it("对于图片类型的文件返回true", () => {
      const imageFile = new File([""], "test.jpg", { type: "image/jpeg" });
      expect(isImageFile(imageFile)).toBe(true);
    });

    it("对于非图片类型的文件返回false", () => {
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      expect(isImageFile(pdfFile)).toBe(false);
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
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            // 调用readAsDataURL后异步触发onload
            setTimeout(() => {
              this.result = mockDataUrl;
              if (this.onload)
                this.onload.call(this, new ProgressEvent("load") as any);
            }, 0);
          }),
        result: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReader) as any;

      // 创建测试文件
      const file = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      // 测试fileToDataUrl函数
      const result = await fileToDataUrl(file);

      // 验证结果
      expect(result).toBe(mockDataUrl);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

      // 恢复原始FileReader
      global.FileReader = originalFileReader;
    });

    it("应该在FileReader错误时拒绝Promise", async () => {
      // 模拟FileReader错误行为
      const mockError = new Error("读取文件失败");
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            // 调用readAsDataURL后异步触发onerror
            setTimeout(() => {
              this.error = mockError;
              if (this.onerror)
                this.onerror.call(this, new ProgressEvent("error") as any);
            }, 0);
          }),
        error: null as Error | null,
        result: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReader) as any;

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
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            setTimeout(() => {
              this.result = new ArrayBuffer(8); // 非字符串结果
              if (this.onload)
                this.onload.call(this, new ProgressEvent("load") as any);
            }, 0);
          }),
        result: null,
      };

      // 模拟全局FileReader构造函数
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(() => mockFileReader) as any;

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

      // 为isImageFile和isPdfFile创建正确的实现，而不是使用mock
      // 这样在fileToMediaContent中调用这些函数时会得到正确的结果
    });

    afterEach(() => {
      global.FileReader = originalFileReader;
      console.error = originalConsoleError;
    });

    it("应该将图片文件转换为Image类型的MediaContent", async () => {
      // 模拟FileReader成功读取图片
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            setTimeout(() => {
              this.result = "data:image/jpeg;base64,mockimagedata";
              if (this.onload)
                this.onload.call(this, new ProgressEvent("load") as any);
            }, 0);
          }),
        result: null,
      };

      global.FileReader = vi.fn(() => mockFileReader) as any;

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
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            setTimeout(() => {
              this.result = "data:application/pdf;base64,mockpdfdata";
              if (this.onload)
                this.onload.call(this, new ProgressEvent("load") as any);
            }, 0);
          }),
        result: null,
      };

      global.FileReader = vi.fn(() => mockFileReader) as any;

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
      const mockFileReader = {
        onload: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        onerror: null as
          | ((this: MockFileReader, ev: ProgressEvent<FileReader>) => any)
          | null,
        readAsDataURL: vi
          .fn()
          .mockImplementation(function (this: MockFileReader) {
            setTimeout(() => {
              this.error = mockError;
              if (this.onerror)
                this.onerror.call(this, new ProgressEvent("error") as any);
            }, 0);
          }),
        error: null as Error | null,
        result: null,
      };

      global.FileReader = vi.fn(() => mockFileReader) as any;

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
