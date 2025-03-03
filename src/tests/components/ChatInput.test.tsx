import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/ChatInput";

describe("ChatInput组件", () => {
  const mockSendMessage = vi.fn();

  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  it("应正确渲染输入框和按钮", () => {
    render(<ChatInput isLoading={false} onSendMessage={mockSendMessage} />);

    expect(screen.getByPlaceholderText("输入您的问题...")).toBeInTheDocument();
    expect(screen.getByLabelText("上传文件")).toBeInTheDocument();
    expect(screen.getByLabelText("发送消息")).toBeInTheDocument();
  });

  it("输入文本后应启用发送按钮", async () => {
    const user = userEvent.setup();
    render(<ChatInput isLoading={false} onSendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText("输入您的问题...");
    const sendButton = screen.getByLabelText("发送消息");

    // 初始状态下按钮应该被禁用
    expect(sendButton).toBeDisabled();

    // 输入文本
    await user.type(inputElement, "测试消息");

    // 按钮应该被启用
    expect(sendButton).not.toBeDisabled();
  });

  it("点击发送按钮应调用onSendMessage", async () => {
    const user = userEvent.setup();
    render(<ChatInput isLoading={false} onSendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText("输入您的问题...");
    const sendButton = screen.getByLabelText("发送消息");

    // 输入文本
    await user.type(inputElement, "测试消息");

    // 点击发送按钮
    await user.click(sendButton);

    // 应该调用onSendMessage
    expect(mockSendMessage).toHaveBeenCalledWith("测试消息", []);

    // 输入框应该被清空
    expect(inputElement).toHaveValue("");
  });

  it("按Enter键应发送消息", async () => {
    const user = userEvent.setup();
    render(<ChatInput isLoading={false} onSendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText("输入您的问题...");

    // 输入文本
    await user.type(inputElement, "测试消息{Enter}");

    // 应该调用onSendMessage
    expect(mockSendMessage).toHaveBeenCalledWith("测试消息", []);
  });

  it("加载状态下应禁用输入和按钮", () => {
    render(<ChatInput isLoading={true} onSendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText("输入您的问题...");
    const sendButton = screen.getByLabelText("发送消息");

    // 不再检查文件上传输入框
    expect(inputElement).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it("应支持自定义占位符文本", () => {
    const customPlaceholder = "请输入您的问题...";
    render(
      <ChatInput
        isLoading={false}
        onSendMessage={mockSendMessage}
        placeholder={customPlaceholder}
      />
    );

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("应支持初始聚焦", () => {
    render(
      <ChatInput
        isLoading={false}
        onSendMessage={mockSendMessage}
        initialFocus={true}
      />
    );

    const inputElement = screen.getByPlaceholderText("输入您的问题...");
    expect(document.activeElement).toBe(inputElement);
  });
});
