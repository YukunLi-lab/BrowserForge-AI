// API Client for BrowserForge AI Backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  status: string;
  generated_code: Record<string, string> | null;
  preview_url: string | null;
  deployed_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_public: boolean;
  forked_from: string | null;
}

export interface ForgeStatus {
  status: string;
  current_agent: string | null;
  progress: number;
  logs: string[];
  error: string | null;
}

export interface DeployResult {
  url: string;
  provider: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  forks_count: number;
  author: User;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  user: User;
}

// API Objects with methods
export const authApi = {
  async login(email: string, password: string): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(email: string, password: string, name: string): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async me(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get user");
    return res.json();
  },
};

export const projectsApi = {
  async list(token: string): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get projects");
    return res.json();
  },

  async create(token: string, data: { name: string; prompt: string; description?: string }): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
  },

  async get(token: string, projectId: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get project");
    return res.json();
  },

  async delete(token: string, projectId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete project");
  },

  async status(token: string, projectId: string): Promise<ForgeStatus> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get forge status");
    return res.json();
  },

  async startForge(token: string, projectId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/forge`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to start forge");
  },

  async deploy(token: string, projectId: string): Promise<DeployResult> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/deploy`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to deploy");
    return res.json();
  },
};

export const galleryApi = {
  async list(_token?: string): Promise<Template[]> {
    const headers: HeadersInit = {};
    if (_token) {
      headers["Authorization"] = `Bearer ${_token}`;
    }
    const res = await fetch(`${API_BASE}/gallery`, { headers });
    if (!res.ok) throw new Error("Failed to get gallery");
    return res.json();
  },

  async fork(token: string, templateId: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/gallery/${templateId}/fork`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fork template");
    return res.json();
  },
};
