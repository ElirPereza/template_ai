import { ChatContainer } from "@/components/chat/chat-container";
import Link from "next/link";

export const metadata = {
  title: "Chat | Template AI",
  description: "Chat with AI agents",
};

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-bold text-zinc-900 dark:text-white"
          >
            Template AI
          </Link>
          <a
            href="http://localhost:8080/scalar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            API Docs
          </a>
        </div>
      </header>

      {/* Chat */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
