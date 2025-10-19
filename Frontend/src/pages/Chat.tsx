import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "@/components/chat/message-bubble";

// ChatMessage interface is defined inside useChat hook; re-export if needed.

export default function ChatPage() {
  const { messages, send, loading, error } = useChat();
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim() || loading) return;
    const toSend = input;
    setInput("");
    send(toSend);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto h-full flex flex-col">
      <Card className="flex-1 min-h-0">
        <CardHeader className="border-b">
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            Ask a question and get an answer from the workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 h-[55vh] overflow-y-auto pr-2">
            {messages.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm">
                Start by asking something.
              </div>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role}>
                {m.content}
              </MessageBubble>
            ))}
            {loading && (
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 w-full"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
      {error && (
        <div className="mt-2 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
