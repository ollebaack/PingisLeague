import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { sendChatMessage } from "@/lib/chat";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SendArgs {
  message: string;
}

async function chatFetcher(_key: string, { arg }: { arg: SendArgs }) {
  const answer = await sendChatMessage(arg.message);
  return answer;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { trigger, isMutating, error } = useSWRMutation(
    "chat/send",
    chatFetcher
  );

  async function send(message: string) {
    if (!message.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    setMessages((m) => [...m, userMsg]);
    try {
      const answer = await trigger({ message });
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      // error state is exposed via error, optionally we could push error message as system role
    }
  }

  return {
    messages,
    send,
    loading: isMutating,
    error: error
      ? error instanceof Error
        ? error.message
        : "Unknown error"
      : null,
  };
}
