"use client";

import { ChatProvider } from "@/lib/chat-context";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import ChatFAB from "@/components/ChatFAB";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto pb-14 md:pb-0"
        style={{ background: "var(--bg)" }}
      >
        {children}
      </main>
      <MobileNav />
      <ChatFAB />
    </ChatProvider>
  );
}
