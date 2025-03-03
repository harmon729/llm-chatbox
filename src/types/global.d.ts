/**
 * 全局类型声明
 * 用于扩展Window接口，添加自定义全局属性
 */

interface Window {
  // Coze环境变量
  ENV_COZE_SHORTCUT_COMMAND_ID?: string | null;
  ENV_COZE_API_KEY?: string | null;
  ENV_COZE_BOT_ID?: string | null;
  ENV_COZE_API_BASE_URL?: string | null;

  // 其他潜在的全局变量
  ENV_API_BASE_URL?: string | null;
}
