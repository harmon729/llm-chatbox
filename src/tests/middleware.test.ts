import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../middleware";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 模拟NextRequest
const createMockRequest = (pathname: string, ip = "127.0.0.1") => {
  return {
    ip,
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(),
    },
    headers: new Headers(),
  } as unknown as NextRequest;
};

// 模拟NextResponse
vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...(actual as any),
    NextResponse: {
      next: vi.fn(() => ({
        headers: new Map(),
      })),
      json: vi.fn((body, options) => ({
        body,
        ...options,
        headers: new Map(Object.entries(options?.headers || {})),
      })),
    },
  };
});

describe("中间件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 重置模块中的rateLimits映射
    vi.resetModules();
  });

  it("非API路由应直接通过", () => {
    const req = createMockRequest("/about");
    const res = middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("API路由应设置速率限制头部", () => {
    const req = createMockRequest("/api/chat");
    const res = middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.headers.has("X-RateLimit-Limit")).toBe(true);
    expect(res.headers.has("X-RateLimit-Remaining")).toBe(true);
    expect(res.headers.has("X-RateLimit-Reset")).toBe(true);
  });

  it("超过请求限制应返回429状态", async () => {
    // 导入middleware模块以访问其内部常量
    const middlewareModule = await import("../middleware");

    // 创建超过限制的请求
    const maxRequests = 50; // 与中间件中的常量保持一致
    const req = createMockRequest("/api/chat");

    // 模拟多次请求，超过限制
    let res;
    for (let i = 0; i <= maxRequests; i++) {
      res = middleware(req);
    }

    // 检查最后一个响应是否为429
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      expect.objectContaining({ status: 429 })
    );
  });

  it("不同IP应分别计数", () => {
    const req1 = createMockRequest("/api/chat", "1.1.1.1");
    const req2 = createMockRequest("/api/chat", "2.2.2.2");

    middleware(req1);
    const res2 = middleware(req2);

    // 第二个IP应该是第一次请求，剩余请求数应该是最大值-1
    expect(res2.headers.get("X-RateLimit-Remaining")).toBe("49");
  });

  it("超时后应重置计数器", async () => {
    // 模拟Date.now以控制时间
    const realDateNow = Date.now.bind(global.Date);
    const dateNowStub = vi.fn(() => 1000);
    global.Date.now = dateNowStub;

    const req = createMockRequest("/api/chat");

    // 第一次请求
    let res = middleware(req);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("49");

    // 模拟时间前进超过时间窗口
    dateNowStub.mockReturnValue(100000);

    // 请求计数应该被重置
    res = middleware(req);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("49");

    // 恢复原始Date.now
    global.Date.now = realDateNow;
  });
});
