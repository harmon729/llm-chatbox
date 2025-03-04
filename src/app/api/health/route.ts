export const runtime = "edge";

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    // 检查必要环境变量是否存在（不泄露实际值）
    env_check: {
      coze_api: !!process.env.COZE_API_KEY,
      bot_id: !!process.env.BOT_ID,
    },
  };

  return new Response(JSON.stringify(healthCheck), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
