"use client";

import { useState, useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  WrenchIcon,
  ChevronDownIcon,
  SearchIcon,
  TruckIcon,
  FileTextIcon,
  CheckCircleIcon,
  MailIcon,
  DatabaseIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

type ToolState = "streaming" | "running" | "completed" | "error";

interface ToolCallProps {
  toolName: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
}

const TOOL_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  lookupInvoice: {
    label: "Invoice lookup",
    icon: <FileTextIcon className="h-3.5 w-3.5" />,
  },
  getShipmentTimeline: {
    label: "Shipment timeline",
    icon: <TruckIcon className="h-3.5 w-3.5" />,
  },
  checkContractTerms: {
    label: "Contract terms",
    icon: <SearchIcon className="h-3.5 w-3.5" />,
  },
  validateCharge: {
    label: "Charge validation",
    icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
  },
  draftResponseEmail: {
    label: "Draft response e-mail",
    icon: <MailIcon className="h-3.5 w-3.5" />,
  },
  updateCrmCase: {
    label: "Update CRM case",
    icon: <DatabaseIcon className="h-3.5 w-3.5" />,
  },
};

const STATE_BADGE: Record<
  ToolState,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  streaming: { label: "Running…", variant: "secondary" },
  running: { label: "Running…", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  error: { label: "Error", variant: "destructive" },
};

function CopyEmailButton({ text }: { text: string }) {
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted/60 border border-border rounded-md transition-all duration-200 cursor-pointer"
      aria-label="Copy email"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-3 w-3" />
          <span>Copy email</span>
        </>
      )}
    </button>
  );
}

function EmailDraft({ output }: { output: Record<string, unknown> }) {
  const email = (output.email as string) || "";
  const subject = (output.subject as string) || "";

  const markdownEmail = emailToMarkdown(email);

  return (
    <div className="space-y-3">
      {subject && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground uppercase tracking-wide">
            Subject
          </span>
          <span className="text-foreground font-medium">{subject}</span>
        </div>
      )}

      <div className="bg-background rounded-lg border border-border p-4">
        <MarkdownRenderer content={markdownEmail} />
      </div>

      <div className="flex justify-end">
        <CopyEmailButton text={email} />
      </div>
    </div>
  );
}

function emailToMarkdown(email: string): string {
  return (
    email
      // "Subject:" line → bold heading
      .replace(/^Subject:\s*(.+)$/m, "**Subject:** $1")
      // Section headers like "FINDINGS SUMMARY:" or "RESOLUTION:" → ### heading
      .replace(/^([A-Z][A-Z\s]+):$/gm, "### $1")
      // Bullet lines "  • " → "- "
      .replace(/^\s*•\s*/gm, "- ")
  );
}

export function ToolCall({ toolName, state, input, output }: ToolCallProps) {
  const [open, setOpen] = useState(false);
  const meta = TOOL_LABELS[toolName] ?? {
    label: toolName,
    icon: <WrenchIcon className="h-3.5 w-3.5" />,
  };
  const badge = STATE_BADGE[state];

  const isEmailOutput =
    toolName === "draftResponseEmail" &&
    state === "completed" &&
    output &&
    typeof output === "object" &&
    "email" in (output as Record<string, unknown>);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mb-2 w-full rounded-lg border border-border bg-muted/30"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors rounded-lg">
        <span className="text-muted-foreground">{meta.icon}</span>
        <span className="font-medium flex-1 text-left">{meta.label}</span>
        <Badge variant={badge.variant} className="text-xs">
          {badge.label}
        </Badge>
        <ChevronDownIcon
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t border-border px-3 py-2 space-y-2">
          {input !== undefined && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Input
              </p>
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto text-foreground/80 whitespace-pre-wrap">
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}
          {output !== undefined && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Output
              </p>
              {isEmailOutput ? (
                <EmailDraft output={output as Record<string, unknown>} />
              ) : (
                <pre className="text-xs bg-background rounded p-2 overflow-x-auto text-foreground/80 whitespace-pre-wrap">
                  {typeof output === "string"
                    ? output
                    : JSON.stringify(output, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
