"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Play,
  Rocket,
  Save,
  SplitSquareVertical,
  File,
  Folder,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { projectsApi, Project, ForgeStatus } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type AgentType = "researcher" | "coder" | "tester" | "deployer";

const agentConfig: Record<AgentType, { label: string; color: string }> = {
  researcher: { label: "Researcher", color: "bg-blue-500" },
  coder: { label: "Coder", color: "bg-green-500" },
  tester: { label: "Tester", color: "bg-yellow-500" },
  deployer: { label: "Deployer", color: "bg-violet-500" },
};

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("project");
  const templateId = searchParams.get("template");

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [forgeStatus, setForgeStatus] = useState<ForgeStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!projectId && !templateId) {
      router.push("/projects");
      return;
    }
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, templateId]);

  const loadProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (projectId) {
      try {
        const data = await projectsApi.get(token, projectId);
        setProject(data);
        if (data.generated_code) {
          setFiles(data.generated_code);
          const firstFile = Object.keys(data.generated_code)[0];
          setActiveFile(firstFile);
        }
      } catch {
        toast({ type: "error", title: "Failed to load project" });
      }
    }
  };

  const startForging = useCallback(async () => {
    if (!projectId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsForging(true);
    setForgeStatus({ status: "forging", current_agent: "researcher", progress: 0, logs: [], error: null });

    try {
      await projectsApi.startForge(token, projectId);
      subscribeToStatus(token, projectId);
    } catch {
      toast({ type: "error", title: "Failed to start forging" });
      setIsForging(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const subscribeToStatus = (token: string, id: string) => {
    eventSourceRef.current = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/projects/${id}/status/stream?token=${token}`
    );

    eventSourceRef.current.onmessage = (event) => {
      const data: ForgeStatus = JSON.parse(event.data);
      setForgeStatus(data);

      if (data.status === "completed") {
        setIsForging(false);
        if (data.logs.length > 0) {
          const lastLog = data.logs[data.logs.length - 1];
          if (lastLog.includes("Generated")) {
            // Load generated files
            loadProject();
          }
        }
        toast({ type: "success", title: "Forge completed!" });
      } else if (data.status === "failed") {
        setIsForging(false);
        toast({ type: "error", title: data.error || "Forge failed" });
      }
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
    };
  };

  const handleDeploy = async () => {
    if (!projectId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsDeploying(true);
    try {
      const result = await projectsApi.deploy(token, projectId);
      setPreviewUrl(result.url);
      toast({ type: "success", title: `Deployed to ${result.provider}!`, description: result.url });
    } catch {
      toast({ type: "error", title: "Deployment failed" });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !projectId) return;

    toast({ type: "info", title: "Saving..." });
    // In real implementation, save files to backend
    await new Promise((r) => setTimeout(r, 500));
    toast({ type: "success", title: "Saved!" });
  };

  const fileList = Object.keys(files);
  const fileExtensions: Record<string, string> = {
    "page.tsx": "typescriptreact",
    "page.jsx": "javascriptreact",
    "layout.tsx": "typescriptreact",
    "layout.jsx": "javascriptreact",
    "layout.css": "css",
    "globals.css": "css",
    "package.json": "json",
    "tsconfig.json": "json",
    "tailwind.config.ts": "typescript",
  };

  const getLanguage = (filename: string) => {
    return fileExtensions[filename] || "typescript";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
            ← Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="font-semibold">{project?.name || "Editor"}</h1>
          {project && (
            <Badge variant="secondary" className="capitalize">
              {project.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={startForging}
            disabled={isForging || !project?.prompt}
            className="gap-2"
          >
            {isForging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isForging ? "Forging..." : "Forge"}
          </Button>
          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={isDeploying || project?.status !== "completed"}
            className="gap-2"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </header>

      {/* Forge Progress */}
      {isForging && forgeStatus && (
        <div className="border-b border-border p-4 bg-muted/30">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full animate-pulse", agentConfig[forgeStatus.current_agent as AgentType]?.color || "bg-gray-500")} />
              <span className="font-medium">
                {agentConfig[forgeStatus.current_agent as AgentType]?.label || "Agent"} Agent
              </span>
            </div>
            <span className="text-sm text-muted-foreground capitalize">
              {forgeStatus.status}...
            </span>
            <div className="flex-1">
              <Progress value={forgeStatus.progress} className="h-2" />
            </div>
          </div>
          <div className="h-20 overflow-auto font-mono text-xs bg-background rounded p-2">
            {forgeStatus.logs.map((log, i) => (
              <div key={i} className="text-muted-foreground">
                {log}
              </div>
            ))}
            {forgeStatus.error && (
              <div className="text-red-500 mt-2">
                Error: {forgeStatus.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-48 border-r border-border overflow-auto shrink-0">
          <div className="p-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
              Files
            </div>
            {fileList.length === 0 ? (
              <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                No files yet. Click Forge to generate code.
              </div>
            ) : (
              fileList.map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                    activeFile === file
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <File className="w-4 h-4 shrink-0" />
                  <span className="truncate">{file}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="flex-1 flex flex-col">
          {activeFile && files[activeFile] !== undefined ? (
            <MonacoEditor
              height="100%"
              language={getLanguage(activeFile)}
              value={files[activeFile]}
              onChange={(value) => {
                if (value) {
                  setFiles({ ...files, [activeFile]: value });
                }
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Folder className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Select a file to edit</p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 border-l border-border flex flex-col shrink-0">
          <div className="h-10 border-b border-border flex items-center justify-between px-3">
            <span className="text-sm font-medium">Preview</span>
            {previewUrl && (
              <Button variant="ghost" size="sm" className="h-7 gap-1">
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>
            )}
          </div>
          <div className="flex-1 bg-white">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <SplitSquareVertical className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Deploy to see live preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorContent />
    </Suspense>
  );
}
