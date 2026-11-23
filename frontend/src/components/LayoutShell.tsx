"use client";

import { usePathname } from "next/navigation";
import { ChatProvider } from "@/lib/chat-context";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import ChatFAB from "@/components/ChatFAB";

export default function LayoutShell({
  children,
  chatRevision,
}: {
  children: React.ReactNode;
  chatRevision: string;
}) {
  const pathname = usePathname();
  // Standalone OAuth documents: no portfolio navigation, chat or chat storage.
  if (pathname === "/rcc" || pathname.startsWith("/rcc/")) {
    return <main className="w-full min-w-0 overflow-y-auto" style={{ background: "#f8f7f5" }}>{children}</main>;
  }
  return (
    <ChatProvider key={chatRevision} contextRevision={chatRevision}>
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
