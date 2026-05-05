"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";

const STORAGE_KEY = "chat-messages";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hello! My name is Kangbeen Ko. Ask anything about me!",
};

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [INITIAL_MESSAGE];
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ChatMessage[];
  } catch {}
  return [INITIAL_MESSAGE];
}

interface ChatContextValue {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatOpen: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  function resetChat() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        loading,
        setLoading,
        chatOpen,
        setChatOpen,
        resetChat,
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
