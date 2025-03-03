import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM对话框组件",
  description: "支持多种输入输出形式的LLM对话框组件",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV_COZE_API_BASE_URL = "${
                process.env.NEXT_PUBLIC_COZE_API_BASE_URL || ""
              }";
              window.ENV_COZE_BOT_ID = "${
                process.env.NEXT_PUBLIC_COZE_BOT_ID || ""
              }";
              window.ENV_COZE_API_KEY = "${
                process.env.NEXT_PUBLIC_COZE_API_KEY || ""
              }";
              window.ENV_COZE_SHORTCUT_COMMAND_ID = "${
                process.env.NEXT_PUBLIC_COZE_SHORTCUT_COMMAND_ID || ""
              }";
              window.ENV_API_BASE_URL = "${
                process.env.NEXT_PUBLIC_API_BASE_URL || ""
              }";
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
