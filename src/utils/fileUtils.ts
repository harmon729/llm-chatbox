/**
 * fileUtils.ts
 * 文件处理工具函数集
 */

import { MediaContent, MediaType } from "@/types/chat";

/**
 * 检查文件是否为图片
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * 检查文件是否为PDF
 */
export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

/**
 * 将文件转换为数据URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader 结果不是字符串"));
      }
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
};

/**
 * 将文件转换为MediaContent对象
 */
export const fileToMediaContent = async (
  file: File
): Promise<MediaContent | null> => {
  try {
    const dataUrl = await fileToDataUrl(file);

    // 根据文件类型创建适当的媒体内容对象
    if (isImageFile(file)) {
      return {
        type: MediaType.Image,
        url: dataUrl,
        name: file.name,
        size: file.size,
      };
    } else if (isPdfFile(file)) {
      return {
        type: MediaType.PDF,
        url: dataUrl,
        name: file.name,
        size: file.size,
      };
    }

    return null;
  } catch (error) {
    console.error("文件转换错误:", error);
    return null;
  }
};
