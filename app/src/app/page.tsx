"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your app in plain English and our agents generate complete, production-ready code.",
  },
  {
    icon: Code2,
    title: "Multi-Agent Pipeline",
    description:
      "Researcher, Coder, Tester, and Deployer agents work together to deliver quality applications.",
  },
  {
    icon: Globe,
    title: "Live Preview",
    description:
      "View and edit your generated code in real-time with our built-in Monaco editor and preview.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Deploy to Vercel or Netlify instantly with auto-generated configurations.",
  },
  {
    icon: Shield,
    title: "Sandbox Security",
    description:
      "All code runs in isolated Docker containers with resource limits for safety.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Parallel agent execution and optimized pipelines get your app live in minutes.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your App",
    description:
      "Tell us what you want to build in natural language. Be as detailed or as simple as you like.",
  },
  {
    number: "02",
    title: "AI Researches & Codes",
    description:
      "Our agents research best practices, generate complete code, and run automated tests.",
  },
  {
    number: "03",
    title: "Preview & Edit",
    description:
      "Review your app in real-time. Make changes directly in our code editor.",
  },
  {
    number: "04",
    title: "Deploy Live",
    description:
      "One click to deploy your app to production. Share your creation with the world.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">BrowserForge</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/gallery"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Gallery
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Now in Public Beta
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Turn Your Ideas Into{" "}
              <span className="gradient-text">Deployable Apps</span>{" "}
              Instantly
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Describe any application in natural language. Our AI agents will
              research, code, test, and deploy it for you. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/editor">
                <Button size="lg" variant="outline" className="gap-2">
                  Try Demo Editor
                </Button>
              </Link>
            </div>
          </div>

          {/* Demo GIF Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  browserforge.ai/editor
                </div>
              </div>
              <div className="bg-muted/50 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    [Demo GIF: Watch your app being generated in real-time]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Build Fast
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From idea to production in minutes, not days. Our AI-powered
              pipeline handles the heavy lifting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How BrowserForge Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four powerful AI agents work together to transform your vision
              into reality.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {step.number !== "04" && (
                  <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Agent Pipeline Visualization */}
          <div className="mt-20 p-8 rounded-xl border border-border bg-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold">Researcher Agent</div>
                  <div className="text-sm text-muted-foreground">
                    Gathers docs & best practices
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold">Coder Agent</div>
                  <div className="text-sm text-muted-foreground">
                    Generates full application
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="font-semibold">Tester Agent</div>
                  <div className="text-sm text-muted-foreground">
                    Runs automated tests
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <div className="font-semibold">Deployer Agent</div>
                  <div className="text-sm text-muted-foreground">
                    Deploys to production
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-violet-600 p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building apps faster with
              BrowserForge AI.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-primary font-semibold"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">BrowserForge</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Discord
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Twitter
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; 2024 BrowserForge AI. MIT License.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
