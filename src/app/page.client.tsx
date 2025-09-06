"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { useReplStore } from "@/stores/repl-store";
import { useSandbox } from "@/hooks/use-sandbox";
import { useReplShortcuts } from "@/hooks/use-repl-shortcuts";
import { Terminal } from "@/components/repl/terminal";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Header } from "@/components/ui/header";
import { useTheme } from "next-themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export function PageClient() {
  const code = useReplStore((s) => s.code);
  const setCode = useReplStore((s) => s.setCode);
  const pushLog = useReplStore((s) => s.pushLog);
  const clearLogs = useReplStore((s) => s.clearLogs);
  const { theme, setTheme } = useTheme();

  const { containerRef, run } = useSandbox((entry) => {
    pushLog(entry);
  });

  const runCode = useMemo(
    () => () => {
      clearLogs();
      run(code);
    },
    [code, clearLogs, run]
  );

  useReplShortcuts(runCode);

  const runCodeRef = useRef(runCode);

  useEffect(() => {
    runCodeRef.current = runCode;
  }, [runCode]);

  return (
    <main className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <Header
        onRun={runCode}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={75} minSize={30}>
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme={theme === "light" ? "vs-light" : "vs-dark"}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-geist-mono)",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: "selection",
              tabSize: 2,
              overviewRulerLanes: 0,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
            onMount={(editor, monaco) => {
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => {
                  runCodeRef.current?.();
                }
              );
              editor.addCommand(
                monaco.KeyMod.Shift | monaco.KeyCode.Enter,
                () => {
                  runCodeRef.current?.();
                }
              );
            }}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25} minSize={8} maxSize={60}>
          <Terminal />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Hidden iframe container for sandboxed execution */}
      <div ref={containerRef} aria-hidden="true" />
    </main>
  );
}
