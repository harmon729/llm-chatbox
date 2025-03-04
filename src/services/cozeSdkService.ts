/**
 * cozeSdkService.ts
 * 使用Coze官方SDK实现AI服务
 */

import {
  CozeAPI,
  COZE_COM_BASE_URL,
  ChatStatus,
  RoleType,
  ChatEventType,
} from "@coze/api";
import { MediaContent } from "@/types/chat";

// 创建Coze API客户端
const createCozeClient = () => {
  const token = process.env.NEXT_PUBLIC_COZE_API_KEY || "";
  const baseURL =
    process.env.NEXT_PUBLIC_COZE_API_BASE_URL || COZE_COM_BASE_URL;

  if (!token) {
    console.error("Coze API Token未设置，请检查环境变量");
    throw new Error("缺少API配置");
  }

  return new CozeAPI({
    token, // 使用PAT或OAuth令牌
    baseURL,
  });
};

/**
 * 从Coze响应中提取有效的回答内容
 * 只返回type为answer的消息内容
 */
const extractAnswerContent = (response: any) => {
  try {
    // 检查是否有完整响应对象
    if (response && response.fullResponse && response.fullResponse.messages) {
      // 查找type为answer的消息
      const answerMessage = response.fullResponse.messages.find(
        (msg: any) => msg.type === "answer"
      );

      // 如果找到了answer类型的消息，返回其内容
      if (answerMessage && answerMessage.content) {
        return answerMessage.content;
      }
    }

    // 如果没有找到answer消息或结构不符合预期，返回原始content
    return response.content || "未能获取有效回答";
  } catch (error) {
    console.error("提取回答内容时出错:", error);
    return response.content || "解析回答时出错";
  }
};

/**
 * 使用Coze SDK发送消息并返回完整响应
 *
 * @param message 用户消息内容
 * @param botId 机器人ID
 * @param userId 用户ID，默认生成一个唯一ID
 * @returns 完整的API响应
 */
export const sendMessageWithCozeSdk = async (
  message: string,
  botId?: string,
  userId: string = `user_${Date.now()}`
) => {
  try {
    const client = createCozeClient();
    const actualBotId = botId || process.env.NEXT_PUBLIC_COZE_BOT_ID || "";

    if (!actualBotId) {
      throw new Error("未提供机器人ID");
    }

    // 发送消息并轮询结果
    const response = await client.chat.createAndPoll({
      bot_id: actualBotId,
      user_id: userId,
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: "text",
        },
      ],
    });

    if (response.chat.status === ChatStatus.COMPLETED) {
      // 直接使用createAndPoll返回的消息数据
      // 不再调用messages.list以避免conversation_id错误
      console.log("聊天已完成，查找答案...");

      // 从response.messages中查找回答
      if (response.messages && Array.isArray(response.messages)) {
        // 查找类型为answer的助手消息
        const answerMessages = response.messages.filter(
          (msg) => msg.role === RoleType.Assistant && msg.type === "answer"
        );

        const latestAnswer =
          answerMessages.length > 0
            ? answerMessages[answerMessages.length - 1]
            : null;

        if (latestAnswer) {
          return {
            success: true,
            content: latestAnswer.content,
            fullResponse: response,
          };
        }

        // 如果没有找到answer类型，尝试查找任何助手消息
        const assistantMessages = response.messages.filter(
          (msg) => msg.role === RoleType.Assistant
        );

        const latestMessage =
          assistantMessages.length > 0
            ? assistantMessages[assistantMessages.length - 1]
            : null;

        if (latestMessage) {
          return {
            success: true,
            content: latestMessage.content,
            fullResponse: response,
          };
        }
      }

      // 如果没有找到任何回答，返回默认消息
      return {
        success: true,
        content: "收到您的消息，但未能获取有效回答",
        fullResponse: response,
      };
    } else {
      console.error("聊天未完成:", response.chat.status);
      return {
        success: false,
        error: `聊天未完成，状态: ${response.chat.status}`,
      };
    }
  } catch (error) {
    console.error("发送消息出错:", error);
    return {
      success: false,
      error: `发送消息出错: ${
        error instanceof Error ? error.message : "未知错误"
      }`,
    };
  }
};

/**
 * 使用Coze SDK发送流式消息
 *
 * @param message 用户消息内容
 * @param media 媒体内容数组
 * @param onChunk 接收数据块的回调函数
 * @param onComplete 响应完成的回调函数
 * @param botId 机器人ID (可选)
 * @returns 清理函数，用于中断请求
 */
export const sendStreamMessageWithCozeSdk = async (
  message: string,
  media: MediaContent[] = [],
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  botId?: string
): Promise<() => void> => {
  const userId = `user_${Date.now()}`;
  let isCancelled = false;

  console.log("开始发送流式消息:", message);
  try {
    const client = createCozeClient();
    const actualBotId = botId || process.env.NEXT_PUBLIC_COZE_BOT_ID || "";

    if (!actualBotId) {
      throw new Error("未提供机器人ID");
    }

    console.log("使用机器人ID:", actualBotId);

    // 发送一条初始响应，让用户知道请求正在处理
    onChunk("正在思考...");

    // 使用官方SDK的stream方法处理流式响应
    const stream = await client.chat.stream({
      bot_id: actualBotId,
      user_id: userId,
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: "text",
        },
      ],
    });

    // 使用异步函数处理流
    const processStream = async () => {
      try {
        let isFirstChunk = true;

        // 使用for await循环处理流式响应
        for await (const part of stream) {
          if (isCancelled) {
            break;
          }

          // 使用正确的类型定义
          if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
            const deltaData = part.data;
            if (deltaData && typeof deltaData.content === "string") {
              // 当收到第一个实际内容时，替换"正在思考..."
              if (isFirstChunk) {
                isFirstChunk = false;
                console.log("收到第一个内容块:", deltaData.content);
                onChunk(deltaData.content);
              } else {
                // 后续内容追加到现有内容
                onChunk(deltaData.content);
              }
            }
          }
        }

        console.log("流式响应完成");
        onComplete?.();
      } catch (error) {
        if (!isCancelled) {
          console.error("处理流式响应出错:", error);
          onChunk(
            `处理响应时出错: ${
              error instanceof Error ? error.message : "未知错误"
            }`
          );
          onComplete?.();
        }
      }
    };

    // 启动处理流程
    processStream();

    // 返回取消函数 - 由于AsyncIterable没有cancel方法，我们只能通过设置标志位来控制循环退出
    return () => {
      console.log("取消流式请求");
      isCancelled = true;
      // 注意：此处我们只能通过isCancelled标志位来控制流处理的终止
      // Coze SDK没有提供直接取消流的方法，我们通过break跳出循环实现取消
    };
  } catch (error) {
    console.error("创建流式聊天时出错:", error);
    // 发送错误信息
    onChunk(
      `创建流式聊天时出错: ${
        error instanceof Error ? error.message : "未知错误"
      }`
    );
    onComplete?.();
    return () => {};
  }
};

/**
 * 获取聊天历史记录
 *
 * @param userId 用户ID
 * @param botId 机器人ID (可选)
 * @returns 历史消息列表
 */
export const getChatHistory = async (userId: string, botId?: string) => {
  try {
    const client = createCozeClient();
    const actualBotId = botId || process.env.NEXT_PUBLIC_COZE_BOT_ID || "";

    if (!actualBotId) {
      throw new Error("未提供机器人ID");
    }

    // 使用任何类型临时解决类型错误
    const response = await (client.chat as any).history({
      bot_id: actualBotId,
      user_id: userId,
      offset: 0,
      limit: 50,
    });

    return {
      success: true,
      history: response.data,
    };
  } catch (error: unknown) {
    console.error("获取历史记录失败:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
};

/**
 * 处理流式消息块，提取有效回答内容
 *
 * @param chunk 流式数据块，可能是字符串或对象
 * @param onChunk 处理文本块的回调函数
 */
const processStreamChunk = (chunk: any, onChunk: (text: string) => void) => {
  try {
    // 记录接收到的数据类型和部分内容
    console.log(
      "收到流式数据块:",
      typeof chunk,
      typeof chunk === "string" && chunk.length > 100
        ? chunk.substring(0, 100) + "..."
        : typeof chunk === "object"
        ? JSON.stringify(chunk).substring(0, 100) + "..."
        : chunk
    );

    // 处理 Coze SDK createAndPoll 的特殊数据格式
    // createAndPoll 可能会返回包含 messages 数组的对象
    if (typeof chunk === "object" && chunk !== null) {
      // 处理包含 messages 的数据格式
      if (
        chunk.messages &&
        Array.isArray(chunk.messages) &&
        chunk.messages.length > 0
      ) {
        // 获取最新的助手消息
        const assistantMessages = chunk.messages.filter(
          (msg: any) => msg.role === RoleType.Assistant
        );

        if (assistantMessages.length > 0) {
          const latestMessage = assistantMessages[assistantMessages.length - 1];
          if (latestMessage.content) {
            console.log(
              "从messages中提取内容:",
              latestMessage.content.substring(0, 30) + "..."
            );
            onChunk(latestMessage.content);
            return;
          }
        }
      }

      // 处理 delta 格式（与 OpenAI 兼容的格式）
      if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
        const content = chunk.choices[0].delta.content;
        if (content) {
          console.log("发送delta内容:", content);
          onChunk(content);
          return;
        }
      }

      // 处理标准答案格式
      if (chunk.type === "answer" && chunk.content) {
        console.log("发送answer内容:", chunk.content.substring(0, 30) + "...");
        onChunk(chunk.content);
        return;
      }

      // 处理通用内容字段
      if (chunk.content) {
        console.log("发送常规内容:", chunk.content.substring(0, 30) + "...");
        onChunk(chunk.content);
        return;
      }

      // 如果找不到有效内容但收到了完整对象，尝试发送序列化的JSON
      console.log("无法识别的数据格式, 尝试使用整个对象");
      const stringContent = JSON.stringify(chunk);
      if (stringContent && stringContent !== "{}") {
        onChunk(stringContent);
      }
      return;
    }

    // 处理字符串格式的数据
    if (typeof chunk === "string") {
      // 尝试解析JSON字符串
      try {
        const data = JSON.parse(chunk);
        console.log("解析JSON成功，类型:", data.type || "未知");

        // 递归调用以处理解析后的对象
        processStreamChunk(data, onChunk);
      } catch (e) {
        // 如果不是有效的JSON，直接发送原始字符串
        console.log("非JSON字符串，直接发送原始内容");
        onChunk(chunk);
      }
      return;
    }

    // 处理其他类型的数据
    console.log("无法处理的数据类型:", typeof chunk);
  } catch (error) {
    console.error("处理流式数据块时出错:", error);
    // 出错时发送错误消息
    onChunk(
      `处理响应数据时出错: ${
        error instanceof Error ? error.message : "未知错误"
      }`
    );
  }
};
