import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useChatMessages } from "../../hooks/useChatMessages";
import { MessageRole, MessageStatus } from "../../types/chat";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  setupApiServiceMocks,
  restoreApiServiceMocks,
} from "../mocks/apiMocks";

// 设置API模拟
setupApiServiceMocks();

describe("useChatMessages Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("应正确初始化空状态", () => {
    const { result } = renderHook(() => useChatMessages());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("应正确初始化带初始消息的状态", () => {
    const initialMessages = [
      {
        id: "1",
        role: MessageRole.Bot,
        content: "系统消息",
        status: MessageStatus.Success,
        timestamp: 1234567890,
      },
      {
        id: "2",
        role: MessageRole.User,
        content: "用户消息",
        status: MessageStatus.Success,
        timestamp: 1234567891,
      },
    ];

    const { result } = renderHook(() => useChatMessages(initialMessages));

    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[0].role).toBe(MessageRole.Bot);
    expect(result.current.messages[0].content).toBe("系统消息");
    expect(result.current.messages[1].role).toBe(MessageRole.User);
    expect(result.current.messages[1].content).toBe("用户消息");
  });

  it("应能添加用户消息", async () => {
    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      result.current.sendMessage("测试消息");
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].role).toBe(MessageRole.User);
    expect(result.current.messages[0].content).toBe("测试消息");
  });

  it("应能添加助手消息", () => {
    const { result } = renderHook(() => useChatMessages());

    act(() => {
      const message = {
        id: "test-id",
        role: MessageRole.Bot,
        content: "助手回复",
        status: MessageStatus.Success,
        timestamp: Date.now(),
      };
      result.current.addMessage(message);
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].role).toBe(MessageRole.Bot);
    expect(result.current.messages[0].content).toBe("助手回复");
  });

  it("应能更新最后一条消息", () => {
    const initialMessages = [
      {
        id: "1",
        role: MessageRole.Bot,
        content: "原始消息",
        status: MessageStatus.Success,
        timestamp: 1234567890,
      },
    ];

    const { result } = renderHook(() => useChatMessages(initialMessages));

    act(() => {
      result.current.updateLastMessage("更新后的消息");
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].content).toBe("更新后的消息");
    expect(result.current.messages[0].status).toBe(MessageStatus.Success);
  });

  it("应在没有消息时安全地更新最后一条消息", () => {
    const { result } = renderHook(() => useChatMessages());

    act(() => {
      result.current.updateLastMessage("更新后的消息");
    });

    expect(result.current.messages.length).toBe(0);
  });

  it("应能删除指定ID的消息", () => {
    const messageId = "test-id";
    const initialMessages = [
      {
        id: messageId,
        role: MessageRole.User,
        content: "测试消息",
        status: MessageStatus.Success,
        timestamp: 1234567890,
      },
    ];

    const { result } = renderHook(() => useChatMessages(initialMessages));

    act(() => {
      result.current.deleteMessage(messageId);
    });

    expect(result.current.messages.length).toBe(0);
  });

  it("应能清空所有消息", () => {
    const initialMessages = [
      {
        id: "1",
        role: MessageRole.User,
        content: "消息1",
        status: MessageStatus.Success,
        timestamp: 1234567890,
      },
      {
        id: "2",
        role: MessageRole.Bot,
        content: "消息2",
        status: MessageStatus.Success,
        timestamp: 1234567891,
      },
    ];

    const { result } = renderHook(() => useChatMessages(initialMessages));

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages.length).toBe(0);
  });

  it("应能设置加载状态", async () => {
    const { result } = renderHook(() => useChatMessages());

    let promise: Promise<void>;

    await act(async () => {
      promise = result.current.sendMessage("测试消息");
    });

    // 消息发送过程中应该处于加载状态
    expect(result.current.isLoading).toBe(true);

    // 等待消息发送完成
    await act(async () => {
      await promise;
    });

    // 加载状态应该结束
    expect(result.current.isLoading).toBe(false);
  });

  it("应能设置错误状态", () => {
    const { result } = renderHook(() => useChatMessages());

    expect(result.current.error).toBeNull();

    // 模拟API错误
    const mockError = new Error("API错误");
    act(() => {
      // @ts-ignore - 直接设置错误状态用于测试
      result.current.setError(mockError);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
