"use client";

import { useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useAgents } from "@/hooks/use-agents";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { AgentSelector } from "./agent-selector";

export function ChatContainer() {
  const { agents, isLoading: agentsLoading } = useAgents();
  const [selectedAgentId, setSelectedAgentId] = useState("web-search-agent");

  const { messages, isLoading, sendMessage, clearMessages } = useChat({
    agentId: selectedAgentId,
  });

  const handleAgentChange = (agentId: string) => {
    setSelectedAgentId(agentId);
    clearMessages();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Chat
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Select an agent and start chatting
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Clear chat
            </button>
          )}
        </div>
        <div className="mt-3">
          <AgentSelector
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelect={handleAgentChange}
            isLoading={agentsLoading}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <MessageInput
          onSend={sendMessage}
          disabled={isLoading}
          placeholder={
            isLoading ? "Thinking..." : "Type a message... (Enter to send)"
          }
        />
      </div>
    </div>
  );
}
