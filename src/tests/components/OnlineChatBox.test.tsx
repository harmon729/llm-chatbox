import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

  // 基本渲染测试
  it("应渲染初始空聊天框", () => {
    render(<OnlineChatBox />);

    // 应显示默认的空状态
    expect(screen.getByText("开始对话吧！发送一条消息。")).toBeInTheDocument();

    // 应显示输入框
    expect(screen.getByPlaceholderText("输入消息...")).toBeInTheDocument();
  });

  // 初始消息测试
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

    // 当有消息时不应显示空状态
    expect(
      screen.queryByText("开始对话吧！发送一条消息。")
    ).not.toBeInTheDocument();
  });

  // 系统消息测试
  it("应正确渲染系统消息", () => {
    render(<OnlineChatBox systemMessage="系统消息" />);

    // 系统消息会显示在UI中
    expect(screen.getByText("系统消息")).toBeInTheDocument();

    // 当有系统消息时，不会显示空状态
    expect(
      screen.queryByText("开始对话吧！发送一条消息。")
    ).not.toBeInTheDocument();
  });

  // 消息发送测试
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

  // 测试发送空消息
  it("应忽略空消息", () => {
    render(<OnlineChatBox />);

    // 获取输入框并输入空消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "   " } });

    // 获取发送按钮并点击
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // API不应被调用
    expect(sendMessageToAPI).not.toHaveBeenCalled();
  });

  // 测试加载状态
  it("应在消息发送过程中显示加载状态", async () => {
    // 模拟API响应延迟
    (sendMessageToAPI as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("AI回复"), 100))
    );

    // 使用自定义的加载组件渲染，确保我们能找到特定的测试id
    render(
      <OnlineChatBox
        loadingComponent={
          <div data-testid="loading-indicator">正在思考...</div>
        }
      />
    );

    // 发送消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "测试消息" } });
    const sendButton = screen.getByLabelText("发送消息");

    fireEvent.click(sendButton);

    // 使用测试ID查找加载指示器
    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });

    // 等待响应完成
    await waitFor(() => {
      expect(screen.getByText("AI回复")).toBeInTheDocument();
      // 加载指示器应消失
      expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    });
  });

  // 自定义placeholder测试
  it("应自定义placeholder", () => {
    const customPlaceholder = "自定义占位符";
    render(<OnlineChatBox placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  // 自定义样式测试
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

  // 错误处理测试
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

    await act(async () => {
      fireEvent.click(sendButton);
    });

    // 等待错误处理
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith(mockError);
    });
  });

  // 自定义加载指示器测试
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
    await act(async () => {
      const sendButton = screen.getByLabelText("发送消息");
      fireEvent.click(sendButton);
    });

    // 检查自定义加载指示器是否显示
    await waitFor(() => {
      const loader = screen.queryByTestId("custom-loader");
      expect(loader).toBeInTheDocument();
    });
  });

  // 自定义空状态测试
  it("应接受自定义空状态组件", () => {
    render(
      <OnlineChatBox
        emptyStateComponent={<div data-testid="custom-empty">自定义空状态</div>}
      />
    );

    // 应显示自定义空状态
    expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
  });

  // 输入框禁用测试
  it("应在加载状态下禁用输入框", async () => {
    // 创建一个可控的Promise来模拟API调用
    let resolvePromise: (value: string) => void;
    const mockPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    // 模拟API调用
    (sendMessageToAPI as any).mockReturnValue(mockPromise);

    render(<OnlineChatBox />);

    // 输入消息
    const textarea = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(textarea, { target: { value: "测试消息" } });

    // 点击发送按钮
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // 检查加载状态下发送按钮是否被禁用
    await waitFor(() => {
      // 在加载状态下，发送按钮应该被禁用
      const disabledSendButton = screen.getByLabelText("发送消息");
      expect(disabledSendButton.disabled).toBe(true);
    });

    // 解析Promise，模拟API调用完成
    await act(async () => {
      resolvePromise("API响应");
    });

    // 加载完成后，输入框应该被清空，需要再次输入文本才能启用发送按钮
    await waitFor(() => {
      // 再次输入消息
      fireEvent.change(textarea, { target: { value: "新消息" } });

      // 现在发送按钮应该被启用
      const enabledSendButton = screen.getByLabelText("发送消息");
      expect(enabledSendButton.disabled).toBe(false);
    });
  });
});
