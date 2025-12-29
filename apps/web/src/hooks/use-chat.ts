"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api/client";
import type { Message } from "@/types";

interface UseChatOptions {
  agentId?: string;
  teamId?: string;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const { agentId = "web-search-agent", teamId, initialMessages = [], onError } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Create placeholder for assistant message
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        agentId: teamId || agentId,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // Use streaming
        const stream = api.runAgentStream(teamId || agentId, {
          message: content.trim(),
          session_id: sessionId || undefined,
          stream: true,
        });

        let fullContent = "";

        for await (const chunk of stream) {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));

        // Update assistant message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: `Error: ${errorMessage}` }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [agentId, teamId, sessionId, isLoading, onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    stopGeneration,
  };
}
