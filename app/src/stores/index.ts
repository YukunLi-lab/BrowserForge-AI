import { create } from "zustand";

interface EditorStore {
  files: Record<string, string>;
  activeFile: string;
  previewUrl: string | null;
  setFiles: (files: Record<string, string>) => void;
  updateFile: (filename: string, content: string) => void;
  setActiveFile: (filename: string) => void;
  setPreviewUrl: (url: string | null) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  files: {},
  activeFile: "",
  previewUrl: null,
  setFiles: (files) => set({ files, activeFile: Object.keys(files)[0] || "" }),
  updateFile: (filename, content) =>
    set((state) => ({ files: { ...state.files, [filename]: content } })),
  setActiveFile: (activeFile) => set({ activeFile }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  reset: () => set({ files: {}, activeFile: "", previewUrl: null }),
}));

interface AuthStore {
  token: string | null;
  user: { id: string; email: string; name: string } | null;
  setToken: (token: string | null) => void;
  setUser: (user: AuthStore["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ token: null, user: null });
  },
}));
