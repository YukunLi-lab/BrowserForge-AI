from app.core.config import get_settings

settings = get_settings()


class ResearcherAgent:
    """
    Researches documentation and best practices using Playwright
    to gather relevant information for code generation.
    """

    def __init__(self):
        self.search_urls = [
            "https://nextjs.org/docs",
            "https://tailwindcss.com/docs",
            "https://ui.shadcn.com/docs",
        ]

    async def run(self, prompt: str) -> dict:
        """
        Research relevant technologies and patterns based on the user prompt.
        Returns structured research data.
        """
        research_data = {
            "components": [],
            "patterns": [],
            "libraries": [],
            "best_practices": [],
        }

        # Simple keyword matching for demo (in production, use LLM + Playwright)
        prompt_lower = prompt.lower()

        if "dashboard" in prompt_lower or "admin" in prompt_lower:
            research_data["components"].extend([
                "DataTable", "Charts", "Stats Card", "Sidebar"
            ])
            research_data["patterns"].append("Dashboard Layout")

        if "auth" in prompt_lower or "login" in prompt_lower or "register" in prompt_lower:
            research_data["components"].extend([
                "Login Form", "Register Form", "Auth Provider"
            ])
            research_data["patterns"].append("Authentication Flow")

        if "todo" in prompt_lower or "task" in prompt_lower:
            research_data["components"].extend([
                "Task List", "Task Item", "Add Task Form"
            ])

        if "blog" in prompt_lower or "post" in prompt_lower:
            research_data["components"].extend([
                "Article Card", "Markdown Renderer", "Comment Section"
            ])

        if "ecommerce" in prompt_lower or "shop" in prompt_lower:
            research_data["components"].extend([
                "Product Card", "Shopping Cart", "Checkout Form"
            ])
            research_data["patterns"].append("E-commerce Flow")

        if "dark mode" in prompt_lower or "theme" in prompt_lower:
            research_data["components"].append("Theme Toggle")
            research_data["best_practices"].append("CSS Variables for theming")

        # Default components for any app
        research_data["components"].extend([
            "Button", "Input", "Card", "Header", "Footer"
        ])

        research_data["libraries"].extend([
            "next", "react", "tailwindcss", "lucide-react"
        ])

        return research_data
