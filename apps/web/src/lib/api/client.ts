import type { Agent, Team, RunRequest, RunResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Health check
  async health(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  // Get all agents
  async getAgents(): Promise<Agent[]> {
    const response = await fetch(`${this.baseUrl}/v1/agents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }
    return response.json();
  }

  // Get all teams
  async getTeams(): Promise<Team[]> {
    const response = await fetch(`${this.baseUrl}/v1/teams`);
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    return response.json();
  }

  // Run agent (non-streaming)
  async runAgent(agentId: string, request: RunRequest): Promise<RunResponse> {
    const response = await fetch(`${this.baseUrl}/v1/agents/${agentId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Agent run failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Run agent with streaming (SSE)
  async *runAgentStream(
    agentId: string,
    request: RunRequest
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseUrl}/v1/agents/${agentId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Agent stream failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              yield parsed.content;
            }
          } catch {
            // If not JSON, yield raw content
            if (data.trim()) {
              yield data;
            }
          }
        }
      }
    }
  }

  // Run team (non-streaming)
  async runTeam(teamId: string, request: RunRequest): Promise<RunResponse> {
    const response = await fetch(`${this.baseUrl}/v1/teams/${teamId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Team run failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const api = new ApiClient(API_URL);

// Export for custom instances
export { ApiClient };
