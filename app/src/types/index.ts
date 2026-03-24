export type { User, Project, Template, ForgeStatus, DeployResult } from "@/lib/api";

export interface AgentLog {
  agent: "researcher" | "coder" | "tester" | "deployer";
  status: "running" | "completed" | "failed";
  message: string;
  timestamp: string;
}

export interface EditorState {
  files: Record<string, string>;
  activeFile: string;
  previewUrl: string | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}
