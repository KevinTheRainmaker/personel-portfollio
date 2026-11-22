import type { ChatMessage } from "./types";

export const CHAT_STORAGE_PREFIX = "chat-messages:";

/** A conversation is useful for follow-ups only under the same public evidence.
 * Client history is still untrusted input, never verified portfolio evidence.
 */
export function selectCurrentHistory(history: unknown, revision: unknown, currentRevision: string): ChatMessage[] {
  if (typeof revision !== "string" || revision !== currentRevision || !Array.isArray(history)) return [];
  return history.flatMap((item: unknown) => {
    if (!item || typeof item !== "object") return [];
    const { role, content } = item as Record<string, unknown>;
    return (role === "user" || role === "assistant") && typeof content === "string"
      ? [{ role, content } as ChatMessage]
      : [];
  });
}

export function chatStorageKey(revision: string): string {
  return `${CHAT_STORAGE_PREFIX}${revision}`;
}

function pruneStoredMessages(storage: Storage, revision: string): void {
  const currentKey = chatStorageKey(revision);
  storage.removeItem("chat-messages");
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key?.startsWith(CHAT_STORAGE_PREFIX) && key !== currentKey) storage.removeItem(key);
  }
}

export function persistCurrentMessages(storage: Storage, revision: string, messages: ChatMessage[]): void {
  pruneStoredMessages(storage, revision);
  storage.setItem(chatStorageKey(revision), JSON.stringify(messages));
}

/** Remove unversioned and stale conversations before restoring the current one. */
export function restoreCurrentMessages(storage: Storage, revision: string): ChatMessage[] {
  pruneStoredMessages(storage, revision);
  const currentKey = chatStorageKey(revision);
  const saved = storage.getItem(currentKey);
  if (!saved) return [];
  try {
    return selectCurrentHistory(JSON.parse(saved), revision, revision);
  } catch {
    storage.removeItem(currentKey);
    return [];
  }
}

/** A deploy during an open chat replaces old context with this fresh exchange. */
export function applyChatResponse(
  currentRevision: string,
  pendingMessages: ChatMessage[],
  question: string,
  response: unknown,
  responseRevision: unknown,
  initialMessage: ChatMessage,
): { revision: string; messages: ChatMessage[] } {
  if (typeof response !== "string") throw new Error("Invalid chat response");
  const revision = typeof responseRevision === "string" && responseRevision.length
    ? responseRevision : currentRevision;
  const messages = revision === currentRevision
    ? pendingMessages
    : [initialMessage, { role: "user" as const, content: question }];
  return { revision, messages: [...messages, { role: "assistant", content: response }] };
}
