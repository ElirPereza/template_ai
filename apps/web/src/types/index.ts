// Agent Types
export interface Agent {
  id: string;
  name: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
}

// Message Types
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
}

// API Request/Response Types
export interface RunRequest {
  message: string;
  session_id?: string;
  user_id?: string;
  stream?: boolean;
}

export interface RunResponse {
  content: string;
  session_id: string;
  agent_id?: string;
  team_id?: string;
}

// Chat State
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

// Streaming Event Types (SSE from AgentOS)
export interface StreamEvent {
  event: string;
  data: string;
  content?: string;
}
