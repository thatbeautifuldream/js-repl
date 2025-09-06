"use client";

import { useRef, useEffect } from "react";
import { useReplStore, type LogEntry } from "@/stores/repl-store";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Terminal() {
  const logs = useReplStore((s) => s.logs);
  const clearLogs = useReplStore((s) => s.clearLogs);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-background border-t border-border">
      <div className="flex h-6 w-full items-center justify-between px-3 text-xs bg-muted/30 border-b border-border/50 flex-shrink-0">
        <span className="font-medium text-muted-foreground">Console</span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <button
            type="button"
            onClick={clearLogs}
            className="hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-muted/50"
            aria-label="Clear console output"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-2 font-mono text-sm leading-5">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">
                No output yet. Use Ctrl/Cmd + Enter to run code.
              </div>
            ) : (
              logs.map((l, i) => <LogLine key={i} entry={l} />)
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function LogLine({ entry }: { entry: LogEntry }) {
  const cls =
    entry.type === "error"
      ? "whitespace-pre-wrap break-words text-red-500"
      : "whitespace-pre-wrap break-words";
  return <div className={cls}>{entry.message}</div>;
}
