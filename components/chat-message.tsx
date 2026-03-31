"use client";

import { useState, useCallback } from "react";
import { UIMessage } from "ai";
import { CopyIcon, CheckIcon } from "lucide-react";
import { ToolCall } from "./tool-call";
import { MarkdownRenderer } from "./markdown-renderer";

interface ChatMessageProps {
  message: UIMessage;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [text]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-all duration-200 cursor-pointer"
      aria-label="Copy response"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    const text = message.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");

    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  const allText =
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .filter(Boolean)
      .join("\n\n") ?? "";

  return (
    <div className="flex justify-start mb-4 group/msg">
      <div className="max-w-[90%] w-full space-y-1">
        {message.parts?.map((part, i) => {
          if (part.type === "text") {
            const textPart = part as { type: "text"; text: string };
            if (!textPart.text) return null;
            return (
              <div
                key={i}
                className="rounded-2xl rounded-tl-sm bg-card border border-border px-5 py-4 text-card-foreground"
              >
                <MarkdownRenderer content={textPart.text} />
              </div>
            );
          }

          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            const toolPart = part as {
              type: string;
              toolName?: string;
              toolCallId: string;
              state: string;
              input?: unknown;
              output?: unknown;
            };

            const toolName =
              part.type === "dynamic-tool"
                ? (toolPart.toolName ?? "")
                : part.type.slice("tool-".length);

            const state =
              toolPart.state === "output-available"
                ? "completed"
                : toolPart.state === "output-error"
                  ? "error"
                  : toolPart.state === "input-streaming"
                    ? "streaming"
                    : "running";

            return (
              <ToolCall
                key={i}
                toolName={toolName}
                state={state}
                input={toolPart.input}
                output={toolPart.output}
              />
            );
          }

          return null;
        })}

        {allText && (
          <div className="flex justify-start pl-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
            <CopyButton text={allText} />
          </div>
        )}
      </div>
    </div>
  );
}
