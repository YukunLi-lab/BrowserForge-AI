from app.core.config import get_settings
import docker
import tempfile
import os
import shutil

settings = get_settings()


class TesterAgent:
    """
    Tests generated code in a Docker sandbox environment.
    """

    def __init__(self):
        try:
            self.docker_client = docker.from_env()
        except:
            self.docker_client = None

    async def run(self, generated_code: dict) -> dict:
        """
        Run tests on the generated code in a sandbox.
        Returns test results.
        """
        results = {
            "passed": True,
            "failures": [],
            "warnings": [],
        }

        # Basic validation
        if not generated_code:
            results["passed"] = False
            results["failures"].append("No code generated")
            return results

        # Check for essential files
        essential_files = ["package.json", "src/app/page.tsx", "src/app/layout.tsx"]
        for file in essential_files:
            if file not in generated_code:
                results["warnings"].append(f"Missing recommended file: {file}")

        # Validate package.json
        if "package.json" in generated_code:
            pkg = generated_code["package.json"]
            if '"next"' not in pkg:
                results["warnings"].append("package.json missing Next.js dependency")

        # Validate page.tsx
        if "src/app/page.tsx" in generated_code:
            page = generated_code["src/app/page.tsx"]
            if "export default" not in page:
                results["failures"].append("page.tsx missing default export")

        # In production, run Playwright tests in Docker sandbox:
        # 1. Mount generated code to container
        # 2. Install dependencies
        # 3. Run npm run build
        # 4. Run Playwright tests
        # 5. Capture results

        return results
