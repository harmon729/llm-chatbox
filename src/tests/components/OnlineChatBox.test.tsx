import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnlineChatBox from "../../components/OnlineChatBox";
import { MessageRole, MessageStatus } from "../../types/chat";
import { sendMessageToAPI } from "../../services/apiService";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 模拟API服务
vi.mock("../../services/apiService", () => ({
  sendMessageToAPI: vi.fn(),
}));

describe("OnlineChatBox组件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应渲染初始空聊天框", () => {
    render(<OnlineChatBox />);

    // 应显示默认的空状态
    expect(screen.getByText("开始对话吧！发送一条消息。")).toBeInTheDocument();

    // 应显示输入框
    expect(screen.getByPlaceholderText("输入消息...")).toBeInTheDocument();
  });

  it("应正确渲染初始消息", () => {
    const initialMessages = [
      {
        id: "1",
        role: MessageRole.User,
        content: "用户消息",
        timestamp: Date.now(),
        status: MessageStatus.Success,
      },
      {
        id: "2",
        role: MessageRole.Bot,
        content: "机器人回复",
        timestamp: Date.now(),
        status: MessageStatus.Success,
      },
    ];

    render(<OnlineChatBox initialMessages={initialMessages} />);

    // 应显示初始消息
    expect(screen.getByText("用户消息")).toBeInTheDocument();
    expect(screen.getByText("机器人回复")).toBeInTheDocument();
  });

  it("应正确渲染系统消息", () => {
    render(<OnlineChatBox systemMessage="系统消息" />);

    // 系统消息会显示在UI中
    expect(screen.getByText("系统消息")).toBeInTheDocument();

    // 当有系统消息时，不会显示空状态
    expect(
      screen.queryByText("开始对话吧！发送一条消息。")
    ).not.toBeInTheDocument();
  });

  it("应允许用户发送消息", async () => {
    // 模拟API响应
    (sendMessageToAPI as any).mockResolvedValue("AI回复");

    render(<OnlineChatBox />);

    // 获取输入框并输入消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "测试消息" } });

    // 获取发送按钮并点击
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // 验证API被调用
    expect(sendMessageToAPI).toHaveBeenCalledWith("测试消息");

    // 等待AI回复显示
    await waitFor(() => {
      expect(screen.getByText("测试消息")).toBeInTheDocument();
      expect(screen.getByText("AI回复")).toBeInTheDocument();
    });
  });

  it("应自定义placeholder", () => {
    const customPlaceholder = "自定义占位符";
    render(<OnlineChatBox placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("应接受自定义样式类名", () => {
    render(
      <OnlineChatBox
        className="custom-chatbox"
        inputClassName="custom-input"
        messagesClassName="custom-messages"
      />
    );

    // 使用screen.getByTestId查找元素
    const container = document.querySelector(".custom-chatbox");
    expect(container).not.toBeNull();

    const messagesContainer = document.querySelector(".custom-messages");
    expect(messagesContainer).not.toBeNull();
  });

  it("应在API错误时调用onError回调", async () => {
    const mockError = new Error("API错误");
    (sendMessageToAPI as any).mockRejectedValue(mockError);

    const onErrorMock = vi.fn();
    render(<OnlineChatBox onError={onErrorMock} />);

    // 获取输入框并输入消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "测试消息" } });

    // 获取发送按钮并点击
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // 等待错误处理
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  it("应接受自定义加载指示器", async () => {
    // 模拟长时间运行的API调用
    (sendMessageToAPI as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("回复"), 100))
    );

    render(
      <OnlineChatBox
        loadingComponent={<div data-testid="custom-loader">加载中...</div>}
      />
    );

    // 获取输入框并输入消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "测试消息" } });

    // 获取发送按钮并点击
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // 检查自定义加载指示器是否显示
    await waitFor(() => {
      const loader = screen.queryByTestId("custom-loader");
      expect(loader).toBeInTheDocument();
    });
  });

  it("应接受自定义空状态组件", () => {
    render(
      <OnlineChatBox
        emptyStateComponent={<div data-testid="custom-empty">自定义空状态</div>}
      />
    );

    // 应显示自定义空状态
    expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
  });
});
