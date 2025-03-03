"use client";

import { useState } from "react";
import InlineChatBox from "@/components/InlineChatBox";
import StandaloneChatBox from "@/components/StandaloneChatBox";

export default function Home() {
  const [demoType, setDemoType] = useState<"inline" | "standalone">("inline");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 页面标题 */}
      <header className="flex bg-white border-b p-4 shadow-sm justify-between items-center">
        <h1 className="flex text-2xl font-bold items-center justify-center">
          Harmon Hsu
        </h1>

        <h1 className="flex text-2xl font-bold flex-1 items-center justify-center">
          LLM对话框组件演示
        </h1>

        {/* 切换按钮 */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border ${
              demoType === "inline"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } rounded-l-md`}
            onClick={() => setDemoType("inline")}
            aria-label="展示内联对话框"
            tabIndex={0}
          >
            内联对话框
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border ${
              demoType === "standalone"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } rounded-r-md`}
            onClick={() => setDemoType("standalone")}
            aria-label="展示独立对话框"
            tabIndex={0}
          >
            独立对话框
          </button>
        </div>
      </header>

      {/* 主内容 */}
      {demoType === "inline" ? (
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">内联对话框示例</h2>
            <p className="text-gray-600 mb-6">
              内联对话框可以嵌入到页面中的任何位置，点击下方的输入框可以展开对话界面。
            </p>
            <div className="mt-4">
              <InlineChatBox />
            </div>
          </div>
        </main>
      ) : (
        <StandaloneChatBox />
      )}
    </div>
  );
}
