"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatContext } from "@/lib/chat-context";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { TextField } from "@/components/ui/text-field";
import type { ChatMessage } from "@/lib/types";

const CHAT_ENDPOINT = "/api/chat";

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

export default function ChatFAB() {
  const [open, setOpen] = useState(false);
  const {
    contextRevision,
    messages,
    setMessages,
    input,
    setInput,
    loading,
    setLoading,
    resetChat,
    acceptResponse,
  } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [open, messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          contextRevision,
          history: messages
            .slice(1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      acceptResponse(trimmed, data.response, data.context_revision, nextMessages);
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
    <>
      {/* Floating action button */}
      <div className="fixed bottom-16 right-4 md:hidden z-40">
        <IconButton
          variant="primary"
          className="shadow-lg"
          style={{ width: 48, height: 48, borderRadius: "50%" }}
          onClick={() => setOpen(true)}
          label="Open chat"
          aria-expanded={open}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          }
        />
        {messages.length > 1 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center pointer-events-none"
            style={{ background: "var(--accent)", fontSize: "10px" }}
          >
            {messages.length - 1 > 9 ? "9+" : messages.length - 1}
          </span>
        )}
      </div>

      {/* Bottom sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col overflow-hidden"
            style={{ height: "70dvh", background: "var(--surface)" }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "var(--border)" }}
              />
            </div>

            {/* Header */}
            <div
              className="px-4 py-2 flex items-center justify-between gap-2 shrink-0 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="min-w-0 text-sm font-semibold"
                style={{ color: "var(--dark)" }}
              >
                Discover with My Digital Twin
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <IconButton
                  size="sm"
                  onClick={resetChat}
                  label="Reset chat"
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                  }
                />
                <IconButton
                  size="sm"
                  onClick={() => setOpen(false)}
                  label="Close chat"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Disclaimer */}
            <p
              className="px-4 py-1.5 text-xs shrink-0"
              style={{ color: "var(--muted)" }}
            >
              Answers may not always be accurate. Please verify if needed.
            </p>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0">
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
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-1.5 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 mb-1.5 space-y-0.5">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-snug">{children}</li>
                          ),
                          a: ({ href, children }) => {
                            const isInternal = href?.startsWith("/");
                            if (isInternal && href) {
                              return (
                                <Link
                                  href={href}
                                  className="underline text-blue-500 hover:text-blue-700"
                                  onClick={() => setOpen(false)}
                                >
                                  {children}
                                </Link>
                              );
                            }
                            return (
                              <a
                                href={href}
                                className="underline text-blue-500 hover:text-blue-700"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
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
            <div className="px-3 pb-4 pt-2 flex gap-2 shrink-0">
              <TextField
                size="lg"
                aria-label="Message to digital twin"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 min-w-0 portfolio-chat-input"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                loading={loading}
                className="shrink-0"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
