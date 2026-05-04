"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";
import { siteConfig } from "@/lib/profile";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/papers", label: "Papers" },
  { href: "/cv", label: "CV" },
];

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hello! My name is Kangbeen Ko. Ask anything about me!",
};

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            background: "var(--muted)",
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </span>
  );
}

function IconEmail() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconScholar() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function resetChat() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages
            .slice(1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Sorry, I could not reach the chat service right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside
      className="shrink-0 border-r flex flex-col overflow-hidden"
      style={{
        width: "380px",
        background: "var(--surface)",
        borderColor: "var(--border)",
        height: "100dvh",
      }}
    >
      {/* Profile avatar */}
      <div className="px-5 pt-5 pb-3 shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image src="/images/profile/avatar.jpg" alt="Kangbeen Ko" width={64} height={64} className="object-cover" />
        </div>
      </div>

      {/* Chat section — takes all remaining space */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Chat header */}
        <div className="px-5 py-2 flex items-center justify-between shrink-0">
          <button
            onClick={() => setChatOpen((v) => !v)}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
          >
            <span
              className={`transition-transform duration-200 ${chatOpen ? "" : "-rotate-90"}`}
              style={{ color: "var(--mid)" }}
            >
              <IconChevronDown />
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--dark)" }}
            >
              Discover with My Digital Twin
            </span>
          </button>
          <button
            onClick={resetChat}
            className="p-1 rounded transition-opacity hover:opacity-60"
            title="Reset chat"
            style={{ color: "var(--muted)" }}
          >
            <IconReset />
          </button>
        </div>

        {chatOpen && (
          <>
            {/* Disclaimer */}
            <p
              className="px-5 pb-2 text-xs leading-relaxed shrink-0"
              style={{ color: "var(--muted)" }}
            >
              Answers may not always be accurate. Please verify if needed.
            </p>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5"
                    style={
                      msg.role === "user"
                        ? {
                            background: "var(--send)",
                            color: "#fff",
                            borderRadius: "18px 18px 4px 18px",
                          }
                        : {
                            background: "#f0f0ee",
                            color: "var(--dark)",
                            borderRadius: "18px 18px 18px 4px",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-3.5 py-2"
                    style={{
                      background: "#f0f0ee",
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <LoadingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 text-sm outline-none rounded-lg px-3 py-2 border"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                  color: "var(--dark)",
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-40"
                style={{ background: "var(--send)" }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div
        className="shrink-0 mx-0 border-t"
        style={{ borderColor: "var(--border)" }}
      />

      {/* Navigation */}
      <nav className="px-3 py-3 shrink-0">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors"
              style={{
                color: active ? "var(--dark)" : "var(--mid)",
                background: active ? "var(--bg)" : "transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom divider */}
      <div
        className="shrink-0 mx-5 border-t"
        style={{ borderColor: "var(--border)" }}
      />

      {/* Social icons */}
      <div
        className="px-5 py-4 flex items-center gap-4 shrink-0"
        style={{ color: "var(--muted)" }}
      >
        <a
          href={`mailto:${siteConfig.email}`}
          className="transition-opacity hover:opacity-60"
          title="Email"
        >
          <IconEmail />
        </a>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-60"
          title="GitHub"
        >
          <IconGitHub />
        </a>
        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-60"
          title="LinkedIn"
        >
          <IconLinkedIn />
        </a>
        <a
          href={siteConfig.links.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-60"
          title="Google Scholar"
        >
          <IconScholar />
        </a>
        {siteConfig.links.instagram && (
          <a
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            title="Instagram"
          >
            <IconInstagram />
          </a>
        )}
      </div>
    </aside>
  );
}
