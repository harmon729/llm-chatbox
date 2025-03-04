/**
 * DOM API 模拟实现
 * 用于在测试环境(JSDOM)中提供浏览器API的模拟实现
 */

// 模拟Element.scrollIntoView方法
if (typeof window !== "undefined") {
  // 检查是否在测试环境中
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {
      // 测试环境中的空实现
      console.log("Mock scrollIntoView called");
    };
  }
}

export default {};
