import { NextResponse } from "next/server";
import {
  sendMessageWithCozeSdk,
  sendStreamMessageWithCozeSdk,
} from "@/services/cozeSdkService";

// 添加Edge运行时配置
export const runtime = "edge";

export const dynamic = "force-dynamic"; // 确保每次请求都重新生成响应

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("收到的原始请求体:", JSON.stringify(body));

    // 从新的请求格式中提取消息内容和用户ID
    let messageContent = "";
    let userId = "";
    let isStream = false;

    // 兼容两种请求格式：
    // 1. 直接的message字段 (前端直接调用)
    // 2. messages数组 (其他客户端使用)
    if (body.message !== undefined) {
      // 直接消息格式
      messageContent = body.message || "";
      userId = body.userId || `user_${Date.now()}`;
      isStream = body.stream !== false; // 默认启用流式响应
    } else {
      // 消息数组格式
      const messages = body.messages || [];
      const userMessage = messages[messages.length - 1] || { content: "" };
      messageContent = userMessage.content || "";
      userId = body.user_id || `user_${Date.now()}`;
      isStream = body.stream !== false;
    }

    // 提取机器人ID
    const botId = process.env.NEXT_PUBLIC_COZE_BOT_ID || "";

    console.log("API路由处理请求，Bot ID:", botId);
    console.log("用户消息:", messageContent);
    console.log("用户ID:", userId);
    console.log("是否流式响应:", isStream);

    if (isStream) {
      // 创建流式响应
      const encoder = new TextEncoder();

      // 创建一个可读流作为响应
      const stream = new ReadableStream({
        async start(controller) {
          try {
            console.log("创建流式响应...");

            // 处理接收到的文本块
            const handleChunk = (chunk: string) => {
              if (chunk) {
                console.log(
                  "收到文本块:",
                  chunk.length > 50 ? `${chunk.substring(0, 50)}...` : chunk
                );

                try {
                  // 尝试解析JSON，检查是否需要提取特定内容
                  const data = JSON.parse(chunk);
                  console.log("成功解析为JSON:", data.type || "未知类型");

                  // 如果是answer类型，直接发送内容
                  if (data.type === "answer" && data.content) {
                    console.log("发送answer内容");
                    controller.enqueue(encoder.encode(data.content));
                    return;
                  }

                  // 否则检查是否有content字段
                  if (data.content) {
                    console.log("发送content内容");
                    controller.enqueue(encoder.encode(data.content));
                    return;
                  }

                  // 如果是delta格式
                  if (
                    data.choices &&
                    data.choices[0] &&
                    data.choices[0].delta
                  ) {
                    const content = data.choices[0].delta.content;
                    if (content) {
                      console.log("发送delta内容");
                      controller.enqueue(encoder.encode(content));
                      return;
                    }
                  }

                  // 没有找到可用内容，尝试发送整个JSON
                  console.log("未找到可用内容，发送原始JSON");
                  controller.enqueue(encoder.encode(JSON.stringify(data)));
                } catch (e) {
                  // 如果不是JSON格式，直接发送原始内容
                  console.log("非JSON格式，直接发送原始内容");

                  // 检查是否为初始的"正在思考..."消息
                  if (chunk === "正在思考...") {
                    controller.enqueue(encoder.encode(chunk));
                  }
                  // 可能是其他非JSON文本内容，也直接发送
                  else {
                    controller.enqueue(encoder.encode(chunk));
                  }
                }
              } else {
                console.log("收到空的文本块");
              }
            };

            // 处理完成回调
            const handleComplete = () => {
              console.log("流式响应完成");
              controller.close();
            };

            // 调用SDK流式发送消息
            await sendStreamMessageWithCozeSdk(
              messageContent,
              [], // 暂不处理媒体内容
              handleChunk,
              handleComplete,
              botId
            );
          } catch (err) {
            console.error("流处理错误:", err);
            controller.enqueue(
              encoder.encode(
                `处理请求发生错误: ${
                  err instanceof Error ? err.message : "未知错误"
                }`
              )
            );
            controller.close();
          }
        },
      });

      // 返回流式响应
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
        },
      });
    } else {
      // 非流式响应
      const response = await sendMessageWithCozeSdk(
        messageContent,
        botId,
        userId
      );

      if (response.success) {
        // 只返回有效内容，不包含其他元数据
        return NextResponse.json({ content: response.content });
      } else {
        return NextResponse.json({ error: response.error }, { status: 500 });
      }
    }
  } catch (err: any) {
    console.error("API路由错误:", err);
    return NextResponse.json(
      { error: `处理请求失败: ${err?.message || "未知错误"}` },
      { status: 500 }
    );
  }
}
