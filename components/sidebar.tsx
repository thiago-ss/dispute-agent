"use client";

import { Plus, Trash2, Hash, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export interface ChatSession {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: ChatSession[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="left"
        showCloseButton={false}
        className="p-0 w-72 max-w-72 flex flex-col bg-sidebar border-r border-sidebar-border gap-0"
      >
        <div className="px-4 py-3 flex items-center gap-3 border-b border-sidebar-border/60">
          <div className="w-8 h-8 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚖️</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-sidebar-foreground leading-tight">
              Dispute resolution
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 leading-tight">
              Chat history
            </span>
          </div>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New dispute
          </button>
        </div>

        <div className="px-5 py-2">
          <span className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
            Active Cases
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent/60 mx-auto mb-3 flex items-center justify-center">
                <Scale className="w-4 h-4 text-sidebar-foreground/30" />
              </div>
              <p className="text-xs text-sidebar-foreground/40">
                No active cases yet.
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group flex items-center justify-between px-2.5 py-2 text-sm rounded-md cursor-pointer transition-all text-sidebar-foreground",
                  activeChatId === chat.id
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground ring-1 ring-sidebar-border/40"
                    : "hover:bg-sidebar-accent/50",
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-1">
                  <Hash
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      activeChatId === chat.id
                        ? "text-primary"
                        : "text-sidebar-foreground/30",
                    )}
                  />
                  <span className="truncate text-[13px]">
                    {chat.title || "New case"}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => onDeleteChat(chat.id, e)}
                    className="p-1 text-sidebar-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded"
                    title="Delete case"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-sidebar-border/60 bg-sidebar/50 text-center">
          <p className="text-[11px] text-sidebar-foreground/40 font-medium">
            Built with Adopt AI
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
