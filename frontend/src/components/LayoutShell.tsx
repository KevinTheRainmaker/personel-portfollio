"use client";

import { ChatProvider } from "@/lib/chat-context";
import Sidebar from "@/components/Sidebar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--bg)" }}
      >
        {children}
      </main>
    </ChatProvider>
  );
}
