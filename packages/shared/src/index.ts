// Shared types and utilities for BrowserForge AI

export type ProjectStatus =
  | "draft"
  | "forging"
  | "testing"
  | "deploying"
  | "completed"
  | "failed";

export type AgentType = "researcher" | "coder" | "tester" | "deployer";

export interface AgentConfig {
  researcher: { name: string; description: string };
  coder: { name: string; description: string };
  tester: { name: string; description: string };
  deployer: { name: string; description: string };
}

export interface ResearchData {
  components: string[];
  patterns: string[];
  libraries: string[];
  best_practices: string[];
}

export interface TestResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  output: string;
}

export interface DeployConfig {
  vercel: string;
  netlify: string;
  dockerfile: string;
}

export const AGENT_CONFIG: AgentConfig = {
  researcher: {
    name: "Researcher Agent",
    description: "Scrapes documentation and best practices using Playwright",
  },
  coder: {
    name: "Coder Agent",
    description: "Generates complete Next.js applications based on user prompts",
  },
  tester: {
    name: "Tester Agent",
    description: "Runs automated tests in Docker sandbox",
  },
  deployer: {
    name: "Deployer Agent",
    description: "Generates deployment configs and deploys to production",
  },
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Draft",
  forging: "Generating...",
  testing: "Testing...",
  deploying: "Deploying...",
  completed: "Completed",
  failed: "Failed",
};
