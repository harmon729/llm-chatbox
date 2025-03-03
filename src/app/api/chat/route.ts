import { NextResponse } from "next/server";
import { PassThrough } from "stream";

export const dynamic = "force-dynamic"; // 确保每次请求都重新生成响应

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("收到的原始请求体:", JSON.stringify(body));

    // 获取环境变量
    const COZE_API_BASE_URL =
      process.env.NEXT_PUBLIC_COZE_API_BASE_URL || "https://api.coze.cn/v3";
    const COZE_BOT_ID =
      body.bot_id ||
      process.env.NEXT_PUBLIC_COZE_BOT_ID ||
      "7477479625686499378";
    const COZE_API_KEY = process.env.NEXT_PUBLIC_COZE_API_KEY || "";
    const COZE_SHORTCUT_COMMAND_ID =
      process.env.NEXT_PUBLIC_COZE_SHORTCUT_COMMAND_ID ||
      body.shortcut_command_id;

    console.log("API路由处理请求，Bot ID:", COZE_BOT_ID);
    if (COZE_SHORTCUT_COMMAND_ID) {
      console.log("使用快捷指令ID:", COZE_SHORTCUT_COMMAND_ID);
    } else {
      console.warn("未提供快捷指令ID，这可能导致API请求失败");
    }

    // 检查是否需要流式响应
    const isStream = body.stream !== false;

    // 提取消息内容
    const messages = [];
    if (body.additional_messages && Array.isArray(body.additional_messages)) {
      messages.push(...body.additional_messages);
    } else if (body.messages && Array.isArray(body.messages)) {
      messages.push(...body.messages);
    }

    // 确保至少有一条消息
    if (messages.length === 0 && body.content) {
      messages.push({
        role: "user",
        content: body.content,
      });
    }

    // 构建请求体 - 根据Coze API v3的格式
    const requestBody = {
      bot_id: COZE_BOT_ID,
      user_id: body.user_id || "default_user",
      auto_save_history: true,
      stream: isStream,
      messages: messages,
      // 添加快捷指令ID（如果有）
      ...(COZE_SHORTCUT_COMMAND_ID && {
        shortcut_command_id: COZE_SHORTCUT_COMMAND_ID,
      }),
    };

    const apiEndpoint = `${COZE_API_BASE_URL}/chat`;
    console.log("发送请求到Coze API:", apiEndpoint);
    console.log("请求体:", JSON.stringify(requestBody));

    // 调用Coze API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${COZE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // 如果不成功，返回错误
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Coze API错误:", {
        status: response.status,
        text: errorText,
      });
      return NextResponse.json(
        { error: `API调用失败: ${response.status}, ${errorText}` },
        { status: response.status }
      );
    }

    console.log("Coze API响应状态码:", response.status);
    console.log(
      "Coze API响应头部:",
      Object.fromEntries(response.headers.entries())
    );

    // 如果不是流式响应，直接返回JSON
    if (!isStream) {
      const data = await response.json();
      console.log(
        "非流式响应数据:",
        JSON.stringify(data).substring(0, 200) + "..."
      );
      return NextResponse.json(data);
    }

    // 添加一个调试用的读取器，用于记录响应内容而不消耗它
    const responseClone = response.clone();
    // 异步读取并记录响应内容
    (async () => {
      try {
        if (responseClone.body) {
          const reader = responseClone.body.getReader();
          const decoder = new TextDecoder();
          let debugOutput = "";
          let chunkCount = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            debugOutput += chunk;
            chunkCount++;

            // 每接收5个数据块打印一次，避免日志过多
            if (chunkCount % 5 === 0) {
              console.log(
                `收到的原始响应数据(${chunkCount}个块)前200字符:`,
                debugOutput.substring(0, 200) + "..."
              );
            }
          }

          console.log(
            "完整的响应数据前500字符:",
            debugOutput.substring(0, 500) + "..."
          );
          console.log("响应数据总长度:", debugOutput.length);
        }
      } catch (error) {
        console.error("读取响应数据出错:", error);
      }
    })();

    // 发送模拟数据测试
    if (response.body === null) {
      // 如果响应体为空，发送测试数据
      console.log("响应体为空，发送测试数据");

      // 创建一个可读流
      const encoder = new TextEncoder();
      const testData = [
        'data: {"content":"你好！","done":false}\n\n',
        'data: {"content":"我是Coze智能助手。","done":false}\n\n',
        'data: {"content":"有什么我可以帮助你的吗？","done":false}\n\n',
        'data: {"content":"","done":true}\n\n',
        "data: [DONE]\n\n",
      ];

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      // 模拟发送数据
      (async () => {
        for (const message of testData) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await writer.write(encoder.encode(message));
          console.log("发送测试数据:", message.trim());
        }
        await writer.close();
      })();

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 对于流式响应，创建自定义转换流
    const { readable, writable } = new TransformStream({
      async transform(chunk, controller) {
        // 转发原始数据块
        controller.enqueue(chunk);

        // 显示接收的数据（用于调试）
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk, { stream: true });
        console.log(
          "转发数据块:",
          text.trim().substring(0, 100) + (text.length > 100 ? "..." : "")
        );
      },
      flush(controller) {
        // 当原始流结束时，发送[DONE]标记
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode('data: {"content":"","done":true}\n\n')
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        console.log("发送[DONE]标记，通知客户端流结束");
      },
    });

    // 开始转发流
    response.body.pipeTo(writable).catch((error) => {
      console.error("流转发错误:", error);
    });

    // 返回流式响应
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(
      "API路由错误:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
