"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Rocket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsApi, Project } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  draft: "secondary",
  forging: "warning",
  testing: "warning",
  deploying: "warning",
  completed: "success",
  failed: "destructive",
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", prompt: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadProjects(token);
  }, [router]);

  const loadProjects = async (token: string) => {
    try {
      const data = await projectsApi.list(token);
      setProjects(data);
    } catch {
      toast({ type: "error", title: "Failed to load projects" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsCreating(true);
    try {
      const project = await projectsApi.create(token, {
        name: newProject.name,
        prompt: newProject.prompt,
      });
      toast({ type: "success", title: "Project created!" });
      router.push(`/editor?project=${project.id}`);
    } catch {
      toast({ type: "error", title: "Failed to create project" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await projectsApi.delete(token, id);
      setProjects(projects.filter((p) => p.id !== id));
      toast({ type: "success", title: "Project deleted" });
    } catch {
      toast({ type: "error", title: "Failed to delete project" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowNewModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project and start building with AI
          </p>
          <Button onClick={() => setShowNewModal(true)}>Create Project</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/editor?project=${project.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || project.prompt}
                  </p>
                  <Badge variant={statusColors[project.status]}>
                    {project.status}
                  </Badge>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Updated {formatDate(project.updated_at)}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl border p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Name</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="My Awesome App"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe Your App
                </label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="A todo app with drag and drop, dark mode, and cloud sync..."
                  value={newProject.prompt}
                  onChange={(e) => setNewProject({ ...newProject, prompt: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create & Start Forging"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
