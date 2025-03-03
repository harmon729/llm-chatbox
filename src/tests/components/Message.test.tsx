import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Message from "@/components/Message";
import {
  Message as MessageType,
  MessageRole,
  MessageStatus,
} from "@/types/chat";

describe("Message组件", () => {
  it("应正确渲染用户消息", () => {
    const userMessage: MessageType = {
      id: "1",
      role: MessageRole.User,
      content: "这是一条用户消息",
      status: MessageStatus.Success,
      timestamp: Date.now(),
    };

    render(<Message message={userMessage} />);

    expect(screen.getByText("您")).toBeInTheDocument();
    expect(screen.getByText("这是一条用户消息")).toBeInTheDocument();
  });

  it("应正确渲染机器人消息", () => {
    const botMessage: MessageType = {
      id: "2",
      role: MessageRole.Bot,
      content: "这是一条机器人消息",
      status: MessageStatus.Success,
      timestamp: Date.now(),
    };

    render(<Message message={botMessage} />);

    expect(screen.getByText("AI助手")).toBeInTheDocument();
    expect(screen.getByText("这是一条机器人消息")).toBeInTheDocument();
  });

  it("应显示加载中状态", () => {
    const loadingMessage: MessageType = {
      id: "3",
      role: MessageRole.Bot,
      content: "正在加载...",
      status: MessageStatus.Sending,
      timestamp: Date.now(),
    };

    const { container } = render(<Message message={loadingMessage} />);

    expect(container.querySelector(".streaming-cursor")).toBeInTheDocument();
  });

  it("应正确渲染Markdown内容", () => {
    const markdownMessage: MessageType = {
      id: "4",
      role: MessageRole.Bot,
      content: "# 标题\n\n这是**加粗**文本",
      status: MessageStatus.Success,
      timestamp: Date.now(),
    };

    render(<Message message={markdownMessage} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("标题")).toBeInTheDocument();
    expect(screen.getByText("加粗")).toBeInTheDocument();
  });

  it("应正确渲染代码块", () => {
    const codeMessage: MessageType = {
      id: "5",
      role: MessageRole.Bot,
      content:
        '```javascript\nconst hello = "world";\nconsole.log(hello);\n```',
      status: MessageStatus.Success,
      timestamp: Date.now(),
    };

    const { container } = render(<Message message={codeMessage} />);

    expect(container.querySelector("pre")).toBeInTheDocument();
    expect(container.querySelector("code")).toBeInTheDocument();
    expect(screen.getByText('const hello = "world";')).toBeInTheDocument();
    expect(screen.getByText("复制")).toBeInTheDocument();
  });
});
