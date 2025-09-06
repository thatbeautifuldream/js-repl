"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LogEntry = { type: "log" | "error"; message: string };

type ReplState = {
  code: string;
  setCode: (code: string) => void;
  logs: LogEntry[];
  pushLog: (entry: LogEntry) => void;
  clearLogs: () => void;
};

const defaultSnippet = `// JavaScript REPL
// Shortcuts:
// - Ctrl/Cmd + Enter: Run code
//
// Write JS below. Use console.log() to print output.

console.log('Hello from Milind's JS REPL!')
`;

export const useReplStore = create<ReplState>()(
  persist(
    (set, get) => ({
      code: defaultSnippet,
      setCode: (code) => set({ code }),
      logs: [],
      pushLog: (entry) => set({ logs: [...get().logs, entry] }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "js-repl",
      storage: createJSONStorage(() => localStorage),
      // Persist both code and logs
      partialize: (s) => ({ code: s.code, logs: s.logs }),
    }
  )
);
