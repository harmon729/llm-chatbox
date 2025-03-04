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
// 导入DOM API模拟实现
import "../mocks/domMocks";

describe("OnlineChatBox组件", () => {
  beforeEach(() => {
    // 重置所有模拟函数
    vi.clearAllMocks();

    // 模拟API服务
    vi.mock("../../services/apiService", () => ({
      sendMessageToAPI: vi.fn((message, media, onChunk, onComplete) => {
        // 默认实现：立即调用回调并返回
        if (onChunk) onChunk("AI回复");
        if (onComplete) onComplete();
        return Promise.resolve(() => {});
      }),
    }));
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

  it.skip("应允许用户发送消息", async () => {
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
    expect(sendMessageToAPI).toHaveBeenCalledWith(
      "测试消息",
      [],
      expect.any(Function),
      expect.any(Function)
    );

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

  it.skip("应在消息发送过程中显示加载状态", async () => {
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

  it.skip("应接受自定义加载指示器", async () => {
    // 使用自定义的加载指示器
    render(
      <OnlineChatBox
        initialMessages={[{ role: "user", content: "测试消息" }]}
        loadingComponent={
          <div data-testid="custom-loader">自定义加载中...</div>
        }
      />
    );

    // 触发发送消息
    const input = screen.getByPlaceholderText("输入消息...");
    fireEvent.change(input, { target: { value: "新消息" } });
    fireEvent.click(screen.getByRole("button", { name: /发送消息/i }));

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

  it.skip("应在加载状态下禁用输入框", async () => {
    render(
      <OnlineChatBox
        initialMessages={[{ role: "user", content: "测试消息" }]}
      />
    );

    // 设置输入值
    const input = screen.getByPlaceholderText(
      "输入消息..."
    ) as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "新消息" } });

    // 获取发送按钮并点击
    const sendButton = screen.getByLabelText("发送消息");
    fireEvent.click(sendButton);

    // 验证输入框被禁用
    expect(input.disabled).toBe(true);
    expect(sendButton.disabled).toBe(true);

    // 手动触发API回调以结束加载状态
    const mockCallback = (sendMessageToAPI as any).mock.calls[0][2]; // 获取onChunk回调
    const mockComplete = (sendMessageToAPI as any).mock.calls[0][3]; // 获取onComplete回调

    act(() => {
      mockCallback("回复内容");
      mockComplete();
    });

    // 等待状态更新
    await waitFor(() => {
      // 验证输入框不再被禁用
      expect(input.disabled).toBe(false);

      // 验证发送按钮不再被禁用 (注意：React中disabled属性是空字符串而不是null)
      expect(sendButton.disabled).toBe(false);
    });
  });
});
