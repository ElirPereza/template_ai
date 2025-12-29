"use client";

import { cn } from "@/lib/utils";
import type { Agent } from "@/types";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelect: (agentId: string) => void;
  isLoading?: boolean;
}

export function AgentSelector({
  agents,
  selectedAgentId,
  onSelect,
  isLoading = false,
}: AgentSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-9 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelect(agent.id)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selectedAgentId === agent.id
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          )}
        >
          {agent.name}
        </button>
      ))}
    </div>
  );
}
