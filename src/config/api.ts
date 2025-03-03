// 获取环境变量（客户端安全）
const getBotId = () => {
  if (typeof window !== "undefined") {
    // 客户端 - 从__NEXT_DATA__或自定义全局变量获取
    return (window as any).__ENV?.NEXT_PUBLIC_COZE_BOT_ID || "";
  }
  // 服务端 - 使用process.env
  return process.env.NEXT_PUBLIC_COZE_BOT_ID || "";
};

export const API_CONFIG = {
  COZE_API_URL: "https://api.coze.cn/v3/chat", // 使用v3版本的API端点
  COZE_BOT_ID: getBotId(),
  // API Key应该只在服务端使用，这里可能需要通过API路由中转
  COZE_API_KEY: "",
};
