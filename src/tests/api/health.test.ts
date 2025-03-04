import { GET } from "../../app/api/health/route";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 模拟环境变量
vi.mock("process", () => ({
  env: {
    NODE_ENV: "test",
    COZE_API_KEY: "mock-api-key",
    BOT_ID: "mock-bot-id",
  },
}));

describe("健康检查API", () => {
  it("应返回200状态码", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it("应返回正确的JSON格式", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("status", "ok");
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("environment", "test");
    expect(data).toHaveProperty("env_check");
    expect(data.env_check).toHaveProperty("coze_api", true);
    expect(data.env_check).toHaveProperty("bot_id", true);
  });
});
