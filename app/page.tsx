"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/header";
import { Sidebar, type ChatSession } from "@/components/sidebar";
import { ChatMessage } from "@/components/chat-message";
import { DisputeInput } from "@/components/dispute-input";
import { DemoDashboard } from "@/components/demo-dashboard";

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

interface ChatWindowProps {
  id: string;
  isActive: boolean;
  onRename: (id: string, text: string) => void;
}

function ChatWindow({ id, isActive, onRename }: ChatWindowProps) {
  const { messages, sendMessage, status } = useChat({
    id,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [inputValue, setInputValue] = useState("");
  const isLoading = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);

  const renamedRef = useRef(false);

  useEffect(() => {
    if (renamedRef.current) return;
    if (messages.length === 1 && messages[0].role === "user") {
      const text =
        messages[0].parts
          ?.filter((p) => p.type === "text")
          .map((p) => (p as { text: string }).text)
          .join("") || "";
      if (text) {
        renamedRef.current = true;
        onRename(id, text);
      }
    }
  }, [messages, id, onRename]);

  useEffect(() => {
    if (isActive) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isActive]);

  function submit(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInputValue("");
    if (messages.length === 0) {
      onRename(id, text);
    }
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit(inputValue);
  }

  if (!isActive) {
    return <div className="hidden h-full"></div>;
  }

  return (
    <>
      <main className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-6 py-16">
            {messages.length === 0 && <DemoDashboard />}

            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start mb-4">
                  <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-2.5">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

            <div ref={bottomRef} className="h-24" />
          </div>
        </ScrollArea>
      </main>

      <DisputeInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleFormSubmit}
        onExampleClick={(msg) => submit(msg)}
        isLoading={isLoading}
      />
    </>
  );
}

export default function Home() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const id = generateId();
      setChats([{ id, title: "New chat" }]);
      setActiveChatId(id);
    }, 0);
  }, []);

  const handleRename = useCallback((id: string, text: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id && c.title === "New chat"
          ? {
              ...c,
              title: text.substring(0, 40) + (text.length > 40 ? "..." : ""),
            }
          : c,
      ),
    );
  }, []);

  function handleNewChat() {
    const id = generateId();
    setChats([{ id, title: "New chat" }, ...chats]);
    setActiveChatId(id);
  }

  function handleSelectChat(id: string) {
    setActiveChatId(id);
  }

  function handleDeleteChat(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const newChats = chats.filter((c) => c.id !== id);
    if (newChats.length === 0) {
      const newId = generateId();
      setChats([{ id: newId, title: "New chat" }]);
      setActiveChatId(newId);
    } else {
      setChats(newChats);
      if (activeChatId === id) {
        setActiveChatId(newChats[0].id);
      }
    }
  }

  if (!mounted || !activeChatId) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
          onNewChat={handleNewChat}
        />

        {chats.map((c) => (
          <ChatWindow
            key={c.id}
            id={c.id}
            isActive={c.id === activeChatId}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
}
