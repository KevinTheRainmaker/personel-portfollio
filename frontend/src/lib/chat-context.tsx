"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";

import { applyChatResponse, persistCurrentMessages, restoreCurrentMessages } from "@/lib/chat-history";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hello! My name is Kangbeen Ko. Ask anything about me!",
};

interface ChatContextValue {
  contextRevision: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatOpen: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
  acceptResponse: (question: string, response: unknown, responseRevision: unknown, pendingMessages: ChatMessage[]) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children, contextRevision }: { children: React.ReactNode; contextRevision: string }) {
  // Render the same initial message on the server and first client render.
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [restored, setRestored] = useState(false);
  const [effectiveRevision, setEffectiveRevision] = useState(contextRevision);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = restoreCurrentMessages(sessionStorage, contextRevision);
      setMessages(saved.length ? saved : [INITIAL_MESSAGE]);
    } catch {
      setMessages([INITIAL_MESSAGE]);
    }
    setRestored(true);
  }, [contextRevision]);

  useEffect(() => {
    if (!restored) return; // Do not overwrite saved messages before restoration.
    try {
      persistCurrentMessages(sessionStorage, effectiveRevision, messages);
    } catch {}
  }, [messages, restored, effectiveRevision]);

  function acceptResponse(question: string, response: unknown, responseRevision: unknown, pendingMessages: ChatMessage[]) {
    const next = applyChatResponse(effectiveRevision, pendingMessages, question, response, responseRevision, INITIAL_MESSAGE);
    setEffectiveRevision(next.revision);
    setMessages(next.messages);
  }

  function resetChat() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  return (
    <ChatContext.Provider
      value={{
        contextRevision: effectiveRevision,
        messages,
        setMessages,
        input,
        setInput,
        loading,
        setLoading,
        chatOpen,
        setChatOpen,
        resetChat,
        acceptResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
