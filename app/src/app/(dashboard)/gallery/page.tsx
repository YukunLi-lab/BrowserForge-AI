"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fork, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { galleryApi, Template } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export default function GalleryPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await galleryApi.list(token || undefined);
      setTemplates(data);
    } catch {
      toast({ type: "error", title: "Failed to load gallery" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFork = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ type: "error", title: "Please sign in to fork templates" });
      return;
    }

    try {
      const project = await galleryApi.fork(token, id);
      toast({ type: "success", title: "Template forked successfully!" });
      window.location.href = `/editor?project=${project.id}`;
    } catch {
      toast({ type: "error", title: "Failed to fork template" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-t-xl" />
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">
          Browse and fork community-created apps
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl">
          <p className="text-muted-foreground">
            No public templates yet. Be the first to share!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {template.thumbnail_url ? (
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {template.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Fork className="w-3 h-3" />
                    {template.forks_count}
                  </span>
                  <span>by {template.author.name}</span>
                  <span>{formatDate(template.created_at)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/editor?template=${template.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Preview
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => handleFork(template.id, e)}
                >
                  <Fork className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
