/**
 * cozeService.ts
 * Coze API服务 - 处理与Coze API的通信
 */

import { MediaContent, LLMResponse } from "@/types/chat";

// 错误消息
const ERROR_MESSAGES = {
  NETWORK: "网络连接失败，请检查您的网络连接。",
  SERVER: "服务器处理请求失败，请稍后重试。",
  GENERAL: "发送消息时出现错误，请稍后重试。",
  STREAM: "流式响应中断，请刷新页面重试。",
  API_KEY_MISSING: "缺少API密钥，请检查环境配置。",
  BOT_ID_MISSING: "缺少机器人ID，请检查环境配置。",
  PARAMETER_ERROR: "API参数错误，请联系开发人员。",
  SHORTCUT_ID_MISSING: "缺少快捷指令ID，请检查环境配置。",
};

// Coze配置
const COZE_CONFIG = {
  // 如果有环境变量则使用环境变量，否则使用默认值（应该在运行时被正确设置）
  SHORTCUT_COMMAND_ID:
    typeof window !== "undefined" ? window.ENV_COZE_SHORTCUT_COMMAND_ID : null,
};

/**
 * 构建媒体内容为Coze API可接受的格式
 * @param media 媒体内容数组
 * @returns 转换后的Coze格式媒体内容
 */
const formatMediaContent = (media: MediaContent[]) => {
  if (!media || media.length === 0) return [];

  return media.map((item) => ({
    type: item.type.toLowerCase(),
    url: item.url,
    // 根据Coze API的要求可能需要添加其他字段
  }));
};

/**
 * 发送消息到Coze API并获取流式响应 (通过本地API代理)
 *
 * @param message 用户消息内容
 * @param media 媒体内容数组
 * @param onChunk 接收数据块的回调函数
 * @param onComplete 响应完成的回调函数
 * @returns 清理函数，用于中断请求
 */
export const sendMessageToCoze = async (
  message: string,
  media: MediaContent[] = [],
  onChunk: (chunk: string) => void,
  onComplete?: () => void
): Promise<() => void> => {
  // 创建AbortController用于中断请求
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    // 构建请求体 - 使用本地API代理，适配Coze API v3
    const requestBody = {
      user_id: "user_" + Date.now(), // 生成一个唯一的用户ID
      messages: [
        {
          role: "user",
          content: message,
          // 如果有媒体内容，则添加到请求中
          ...(media.length > 0 && { media: formatMediaContent(media) }),
        },
      ],
      stream: true, // 启用流式响应
      // 添加快捷指令ID（如果有）
      ...(COZE_CONFIG.SHORTCUT_COMMAND_ID && {
        shortcut_command_id: COZE_CONFIG.SHORTCUT_COMMAND_ID,
      }),
    };

    console.log("准备发送请求到本地API代理:", "/api/chat");
    console.log("请求体:", JSON.stringify(requestBody));

    // 发送请求到本地API代理
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    console.log("API响应状态:", response.status);
    console.log("API响应头部:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API错误:", response.status, errorText);
      onChunk(`服务器返回错误: ${response.status}`);
      if (onComplete) onComplete(); // 通知完成（出错）
      return () => controller.abort();
    }

    // 检查响应是否支持流式传输
    if (!response.body) {
      console.error("响应不支持流式传输");
      onChunk(ERROR_MESSAGES.STREAM);
      if (onComplete) onComplete(); // 通知完成（出错）
      return () => controller.abort();
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    console.log("开始处理流式响应");

    // 记录收到的总内容（用于调试）
    let receivedContent = "";
    let hasReceivedContent = false;

    // 异步处理流数据
    const processStream = async () => {
      try {
        let isDone = false;

        while (!isDone) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("流式响应完成（读取器返回done）");
            if (!hasReceivedContent) {
              console.log("整个响应过程中未收到任何有效内容");
              onChunk("抱歉，服务器没有返回有效回复。");
            }
            if (onComplete) onComplete(); // 通知前端响应已完成
            break;
          }

          // 解码二进制数据
          const chunk = decoder.decode(value, { stream: true });
          console.log("收到数据块原始内容:", chunk);
          receivedContent += chunk;

          // 尝试不同的解析方式处理SSE格式的数据
          try {
            // 1. 首先尝试标准的SSE格式解析（data: {...} 格式）
            const lines = chunk
              .split("\n")
              .filter((line) => line.trim() !== "");

            let hasProcessedValidData = false;

            for (const line of lines) {
              console.log("处理行:", line);

              try {
                // 检查是否为SSE格式
                if (line.startsWith("data:")) {
                  const jsonStr = line.substring(5).trim();

                  // 检查是否为[DONE]标记
                  if (jsonStr === "[DONE]") {
                    console.log("收到[DONE]标记，响应结束");
                    isDone = true;
                    if (onComplete) onComplete(); // 通知前端响应已完成
                    break;
                  }

                  // 尝试解析JSON数据
                  try {
                    const data = JSON.parse(jsonStr) as LLMResponse;
                    console.log("解析到JSON数据:", data);

                    // 检查是否有错误信息
                    if (data.status === "failed" && data.last_error) {
                      console.error("Coze API返回错误:", data.last_error);
                      const errorMsg =
                        data.last_error.code === 4000
                          ? `${ERROR_MESSAGES.PARAMETER_ERROR}（错误码：${data.last_error.code}，信息：${data.last_error.msg}）`
                          : `错误 ${data.last_error.code}: ${data.last_error.msg}`;
                      onChunk(errorMsg);
                      isDone = true;
                      if (onComplete) onComplete();
                      break;
                    }

                    // 处理对话内容响应
                    if (
                      data.choices &&
                      data.choices.length > 0 &&
                      data.choices[0].delta &&
                      data.choices[0].delta.content
                    ) {
                      // 处理官方标准格式（choices.delta.content）
                      onChunk(data.choices[0].delta.content);
                      hasReceivedContent = true;
                      hasProcessedValidData = true;
                    } else if (data.content) {
                      // 处理兼容格式（content字段）
                      onChunk(data.content);
                      hasReceivedContent = true;
                      hasProcessedValidData = true;
                    }

                    // 检查响应是否包含完成标志
                    if (
                      data.done ||
                      (data.choices &&
                        data.choices.length > 0 &&
                        data.choices[0].finish_reason === "stop")
                    ) {
                      console.log("响应数据包含完成标记");
                      isDone = true;
                      if (onComplete) onComplete(); // 通知前端响应已完成
                      break;
                    }
                  } catch (e) {
                    console.warn("解析JSON数据出错:", e);
                  }
                }
                // 2. 尝试解析非标准格式（可能是直接的文本内容）
                else if (line.trim().length > 0) {
                  // 如果不是data:开头但有内容，可能是直接的文本
                  console.log("收到非SSE格式数据，尝试直接处理:", line);

                  // 尝试作为JSON解析
                  try {
                    const data = JSON.parse(line) as any;
                    if (data.content) {
                      onChunk(data.content);
                      hasReceivedContent = true;
                      hasProcessedValidData = true;
                    }
                  } catch (e) {
                    // 不是JSON，直接作为文本内容处理
                    onChunk(line);
                    hasReceivedContent = true;
                    hasProcessedValidData = true;
                  }
                }
              } catch (e) {
                console.warn("处理行数据出错:", e);
              }
            }

            // 如果没有从标准格式中提取到数据，尝试其他格式
            if (!hasProcessedValidData && chunk.trim().length > 0) {
              console.log("尝试处理非标准格式的整块数据");

              // 3. 尝试整个数据块作为JSON
              try {
                const data = JSON.parse(chunk.trim()) as any;
                if (data.content) {
                  onChunk(data.content);
                  hasReceivedContent = true;
                }
                if (data.text) {
                  onChunk(data.text);
                  hasReceivedContent = true;
                }
                if (data.done) {
                  isDone = true;
                  if (onComplete) onComplete();
                }
              } catch (e) {
                // 4. 如果不是JSON，可能是纯文本内容
                if (chunk.trim().length > 0 && !chunk.includes("data:")) {
                  console.log("作为纯文本内容处理");
                  onChunk(chunk.trim());
                  hasReceivedContent = true;
                }
              }
            }
          } catch (error) {
            console.error("解析流数据块出错:", error);
          }
        }

        // 如果流结束但没收到任何内容，发送一个默认消息
        if (!hasReceivedContent) {
          console.log("未收到任何内容，发送默认消息");
          onChunk("我没有收到有效的回复。请稍后再试。");
        }

        // 流处理完成
        console.log("流处理完成");
        if (onComplete) onComplete();
      } catch (error) {
        console.error("读取流出错:", error);

        if (error.name === "AbortError") {
          console.log("请求被中断");
        } else {
          console.error("读取流出错:", error);
          onChunk(ERROR_MESSAGES.STREAM);
        }

        if (!hasReceivedContent) {
          onChunk("处理响应时出错，请稍后再试。");
        }

        if (onComplete) onComplete(); // 通知前端响应已完成（出错）
      }
    };

    // 开始处理流
    processStream();

    // 返回清理函数
    return () => {
      controller.abort();
      if (onComplete) onComplete(); // 确保取消请求时也通知完成
    };
  } catch (error) {
    console.error("请求错误:", error);
    if (error.name === "AbortError") {
      console.log("请求被中断");
    } else {
      onChunk(ERROR_MESSAGES.NETWORK);
    }
    if (onComplete) onComplete(); // 通知前端响应已完成（出错）
    return () => controller.abort();
  }
};
