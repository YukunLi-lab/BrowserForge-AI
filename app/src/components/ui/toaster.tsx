"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

const toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export function toast(options: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { ...options, id }];
  toastListeners.forEach((listener) => listener([...toasts]));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastListeners.forEach((listener) => listener([...toasts]));
  }, 5000);
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setCurrentToasts);
    return () => {
      const index = toastListeners.indexOf(setCurrentToasts);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-fade-in",
            {
              "bg-green-500/10 border-green-500/50 text-green-500":
                t.type === "success",
              "bg-red-500/10 border-red-500/50 text-red-500": t.type === "error",
              "bg-blue-500/10 border-blue-500/50 text-blue-500":
                t.type === "info",
              "bg-yellow-500/10 border-yellow-500/50 text-yellow-500":
                t.type === "warning",
            }
          )}
        >
          <div className="flex-1">
            <div className="font-medium">{t.title}</div>
            {t.description && (
              <div className="text-sm opacity-80">{t.description}</div>
            )}
          </div>
          <button
            onClick={() => {
              toasts = toasts.filter((toast) => toast.id !== t.id);
              toastListeners.forEach((listener) => listener([...toasts]));
            }}
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
