import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 简单的内存存储，生产环境建议使用Redis等外部存储
const rateLimits = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS = 50; // 每个时间窗口最大请求数
const TIME_WINDOW = 60 * 1000; // 时间窗口，单位毫秒（这里是1分钟）

export function middleware(request: NextRequest) {
  // 仅对API路由应用速率限制
  if (!request.nextUrl.pathname.startsWith("/api/chat")) {
    return NextResponse.next();
  }

  // 获取IP地址或用户标识
  const ip = request.ip || "anonymous";
  const now = Date.now();

  // 获取当前限制状态
  const rateLimit = rateLimits.get(ip) || { count: 0, timestamp: now };

  // 如果超过了时间窗口，重置计数
  if (now - rateLimit.timestamp > TIME_WINDOW) {
    rateLimit.count = 0;
    rateLimit.timestamp = now;
  }

  // 增加计数
  rateLimit.count++;
  rateLimits.set(ip, rateLimit);

  // 设置RateLimit头部
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", MAX_REQUESTS.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    Math.max(0, MAX_REQUESTS - rateLimit.count).toString()
  );
  response.headers.set(
    "X-RateLimit-Reset",
    (Math.ceil(rateLimit.timestamp / TIME_WINDOW) * TIME_WINDOW).toString()
  );

  // 如果超过限制，返回429状态码
  if (rateLimit.count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          ...Object.fromEntries(response.headers),
        },
      }
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
