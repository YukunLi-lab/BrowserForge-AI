from app.core.config import get_settings

settings = get_settings()


class CoderAgent:
    """
    Generates complete Next.js applications based on user prompts
    and research data from the Researcher Agent.
    """

    def __init__(self):
        self.project_template = {
            "package.json": self._generate_package_json(),
            "tsconfig.json": self._generate_tsconfig(),
            "tailwind.config.ts": self._generate_tailwind_config(),
            "next.config.js": self._generate_next_config(),
            "src/app/globals.css": self._generate_globals_css(),
            "src/app/layout.tsx": self._generate_layout(),
            "src/app/page.tsx": "",
            "src/components/ui/button.tsx": self._generate_button_component(),
            "src/components/ui/card.tsx": self._generate_card_component(),
            "src/components/ui/input.tsx": self._generate_input_component(),
        }

    async def run(self, prompt: str, research_data: dict) -> dict:
        """
        Generate a complete Next.js application based on the prompt and research.
        Returns a dictionary of filename -> content mappings.
        """
        files = self.project_template.copy()

        # Generate the main page based on prompt
        files["src/app/page.tsx"] = self._generate_page(prompt, research_data)

        return files

    def _generate_package_json(self) -> str:
        return '''{
  "name": "generated-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}'''

    def _generate_tsconfig(self) -> str:
        return '''{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}'''

    def _generate_tailwind_config(self) -> str:
        return '''import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;'''

    def _generate_next_config(self) -> str:
        return '''/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;'''

    def _generate_globals_css(self) -> str:
        return '''@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --background: 0 0% 100%; --foreground: 0 0% 3.9%; }
.dark { --background: 0 0% 3.9%; --foreground: 0 0% 98%; }
body { color: hsl(var(--foreground)); background: hsl(var(--background)); }'''

    def _generate_layout(self) -> str:
        return '''import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generated App",
  description: "Created with BrowserForge AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}'''

    def _generate_page(self, prompt: str, research_data: dict) -> str:
        # Generate page based on the prompt
        components = research_data.get("components", [])

        # Build a dynamic page based on components found
        component_imports = []
        component_usage = []

        for comp in components[:5]:
            comp_lower = comp.lower().replace(" ", "")
            if comp_lower == "button":
                component_imports.append('import { Button } from "@/components/ui/button";')
                component_usage.append('<Button className="mb-4">Click Me</Button>')
            elif comp_lower == "card":
                component_imports.append('import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";')
                component_usage.append('''<Card className="p-4 mb-4"><CardHeader><CardTitle>Welcome</CardTitle></CardHeader><CardContent>Your app content here</CardContent></Card>''')
            elif comp_lower == "input":
                component_imports.append('import { Input } from "@/components/ui/input";')
                component_usage.append('<Input placeholder="Enter text..." className="mb-4" />')

        if not component_usage:
            component_usage.append('<div className="text-center py-20"><h1 className="text-4xl font-bold">Your App</h1><p className="text-gray-600 mt-2">Edit src/app/page.tsx to customize</p></div>')

        imports_str = "\\n".join(set(component_imports))
        usage_str = "\\n".join(component_usage)

        return f'''"use client";

import { {", ".join(set([c.split()[0] for c in components[:5]])) or "div"} } from "lucide-react";
{imports_str}

export default function HomePage() {{
  return (
    <main className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Generated App</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {usage_str}
      </div>
    </main>
  );
}}'''

    def _generate_button_component(self) -> str:
        return '''import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50",
  {{
    variants: {{
      variant: {{ default: "bg-primary text-white hover:bg-primary/90", outline: "border border-input hover:bg-accent" }},
      size: {{ default: "h-10 px-4 py-2", sm: "h-8 px-3" }},
    }},
    defaultVariants: {{ variant: "default", size: "default" }},
  }}
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {{
  asChild?: boolean;
}}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({{ className, variant, size, ...props }}, ref) => (
    <button className={{cn(buttonVariants({{ variant, size }}), className)}} ref={{ref}} {{...props}} />
  )
);
Button.displayName = "Button";
export {{ Button, buttonVariants }};'''

    def _generate_card_component(self) -> str:
        return '''import * as React from "react";
import {{ cn }} from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({{ className, ...props }}, ref) => (
    <div ref={{ref}} className={{cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}} {{...props}} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({{ className, ...props }}, ref) => (
    <div ref={{ref}} className={{cn("flex flex-col space-y-1.5 p-6", className)}} {{...props}} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({{ className, ...props }}, ref) => (
    <h3 ref={{ref}} className={{cn("font-semibold leading-none tracking-tight", className)}} {{...props}} />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({{ className, ...props }}, ref) => (
    <div ref={{ref}} className={{cn("p-6 pt-0", className)}} {{...props}} />
  )
);
CardContent.displayName = "CardContent";

export {{ Card, CardHeader, CardTitle, CardContent }};

export function cn(...inputs: any[]) {{
  return inputs.filter(Boolean).join(" ");
}};'''

    def _generate_input_component(self) -> str:
        return '''import * as React from "react";
import {{ cn }} from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({{ className, ...props }}, ref) => (
    <input
      className={{cn("flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50", className)}}
      ref={{ref}}
      {{...props}}
    />
  )
);
Input.displayName = "Input";

export {{ Input }};

export function cn(...inputs: any[]) {{
  return inputs.filter(Boolean).join(" ");
}};'''
