"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";

interface ToastContextType {
  // Tell a guest they need to sign in for the action they just tried.
  showSignInPrompt: (message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showSignInPrompt = useCallback((msg = "Sign in to do that.") => {
    setMessage(msg);
  }, []);

  const close = () => setMessage(null);

  return (
    <ToastContext.Provider value={{ showSignInPrompt }}>
      {children}
      <Snackbar
        open={message !== null}
        autoHideDuration={5000}
        onClose={(_e, reason) => {
          if (reason !== "clickaway") close();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div
          role="status"
          className="flex items-center gap-4 rounded-xl bg-dark-900 text-white pl-5 pr-2 py-2 shadow-lg font-display"
        >
          <span className="text-base">{message}</span>
          <Link
            href="/signup"
            onClick={close}
            className="rounded-lg bg-accent-200 text-dark-900 font-semibold px-4 py-1.5 hover:opacity-90 transition-opacity"
          >
            Sign in
          </Link>
        </div>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// No-op outside the provider rather than throwing: the legacy src/pages/*
// routes render without app/layout.tsx and still use components that call this.
const noopToast: ToastContextType = { showSignInPrompt: () => {} };

export function useToast() {
  return useContext(ToastContext) ?? noopToast;
}
