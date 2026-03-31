import { PanelLeft, Plus } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export function Header({ onToggleSidebar, onNewChat }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onToggleSidebar}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <a
              href="https://www.adopt.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Adopt AI Logo" className="h-8 w-auto" />
            </a>
            <div className="w-px h-6 bg-border" />
            <span className="text-lg font-semibold text-foreground">
              Dispute agent
            </span>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </header>
  );
}
