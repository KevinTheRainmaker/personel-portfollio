"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SUGGESTIONS = [
  "What is Kangbeen's research focus?",
  "Tell me about LEGOLAS",
  "What projects has he built?",
];

function BotIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <path d="M9 8V5a3 3 0 016 0v3" />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastModel, setLastModel] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.response },
      ]);
      setLastModel(data.model_used ?? null);
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        {open ? <CloseIcon /> : <BotIcon />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border animate-fade-up"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
            height: "520px",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between shrink-0"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                <BotIcon />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--dark)" }}
                >
                  Ask about Kangbeen
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  AI Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg transition-colors hover:bg-opacity-80"
              style={{ color: "var(--muted)" }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p
                  className="text-sm text-center py-2"
                  style={{ color: "var(--muted)" }}
                >
                  Hi! Ask me anything about Kangbeen&apos;s research, projects,
                  or background.
                </p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors hover:border-opacity-80"
                      style={{
                        background: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--mid)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "var(--accent)",
                          color: "#fff",
                          borderRadius: "18px 18px 4px 18px",
                        }
                      : {
                          background: "var(--surface)",
                          color: "var(--dark)",
                          border: "1px solid var(--border)",
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
                  className="rounded-2xl px-3.5 py-2"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Model badge */}
          {lastModel && (
            <div className="px-4 pb-1">
              <p
                className="text-xs font-mono"
                style={{ color: "var(--muted)" }}
              >
                {lastModel.split("/").pop()}
              </p>
            </div>
          )}

          {/* Input */}
          <div
            className="px-3 pb-3 pt-2 border-t shrink-0"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex items-end gap-2 rounded-xl border px-3 py-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed max-h-24"
                style={{ color: "var(--dark)" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <SendIcon />
              </button>
            </div>
            <p
              className="text-xs mt-1.5 text-center"
              style={{ color: "var(--muted)" }}
            >
              Press Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}
    </>
  );
}
