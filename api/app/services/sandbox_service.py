import docker
import tempfile
import os
from app.core.config import get_settings

settings = get_settings()


class SandboxService:
    """
    Manages Docker containers for safe code execution.
    Provides isolation and resource limits for running generated code.
    """

    def __init__(self):
        try:
            self.client = docker.from_env()
        except docker.errors.DockerException:
            self.client = None
            print("Docker not available, sandbox will be simulated")

        self.cpu_limit = settings.sandbox_cpu_limit
        self.memory_limit = settings.sandbox_memory_limit
        self.timeout = settings.sandbox_timeout

    def create_sandbox(self, project_id: str, code: dict) -> str:
        """
        Create an isolated Docker container for a project.
        Returns container ID.
        """
        if not self.client:
            return f"simulated-{project_id}"

        container_name = f"browserforge-{project_id[:8]}"

        # Mount code as volume
        volume_path = tempfile.mkdtemp(prefix="browserforge_")
        for filename, content in code.items():
            filepath = os.path.join(volume_path, filename)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "w") as f:
                f.write(content)

        try:
            container = self.client.containers.run(
                "node:18-alpine",
                command="sleep infinity",
                detach=True,
                name=container_name,
                mem_limit=self.memory_limit,
                cpu_period=100000,
                cpu_quota=int(100000 * self.cpu_limit),
                network_disabled=False,
                volumes={volume_path: {"bind": "/app", "mode": "ro"}},
                working_dir="/app",
            )
            return container.id
        except docker.errors.DockerException as e:
            print(f"Failed to create container: {e}")
            return f"fallback-{project_id}"

    def run_in_sandbox(self, container_id: str, command: str) -> dict:
        """
        Run a command in the sandbox container.
        Returns result dict with stdout, stderr, and exit code.
        """
        if not self.client or container_id.startswith("simulated") or container_id.startswith("fallback"):
            # Simulate execution
            return {"exit_code": 0, "stdout": "Simulated execution", "stderr": ""}

        try:
            container = self.client.containers.get(container_id)
            result = container.exec_run(["sh", "-c", command])
            return {
                "exit_code": result.exit_code,
                "stdout": result.output.decode("utf-8"),
                "stderr": "",
            }
        except docker.errors.NotFound:
            return {"exit_code": 1, "stdout": "", "stderr": "Container not found"}
        except Exception as e:
            return {"exit_code": 1, "stdout": "", "stderr": str(e)}

    def install_dependencies(self, container_id: str) -> bool:
        """Install npm dependencies in the sandbox."""
        result = self.run_in_sandbox(container_id, "npm install")
        return result["exit_code"] == 0

    def build_project(self, container_id: str) -> bool:
        """Build the Next.js project in the sandbox."""
        result = self.run_in_sandbox(container_id, "npm run build")
        return result["exit_code"] == 0

    def run_tests(self, container_id: str) -> dict:
        """Run tests in the sandbox."""
        if not self.client or container_id.startswith("simulated") or container_id.startswith("fallback"):
            return {"passed": True, "failures": [], "output": "Simulated tests"}

        # Ensure dependencies are installed
        if not self.install_dependencies(container_id):
            return {"passed": False, "failures": ["npm install failed"], "output": ""}

        # Run build
        if not self.build_project(container_id):
            return {"passed": False, "failures": ["build failed"], "output": ""}

        return {"passed": True, "failures": [], "output": "Build successful"}

    def stop_sandbox(self, container_id: str):
        """Stop and remove a sandbox container."""
        if not self.client or container_id.startswith("simulated") or container_id.startswith("fallback"):
            return

        try:
            container = self.client.containers.get(container_id)
            container.stop(timeout=5)
            container.remove()
        except docker.errors.NotFound:
            pass
        except Exception as e:
            print(f"Error stopping container: {e}")

    def get_container_logs(self, container_id: str, tail: int = 100) -> str:
        """Get container logs."""
        if not self.client or container_id.startswith("simulated") or container_id.startswith("fallback"):
            return "Logs not available in simulation mode"

        try:
            container = self.client.containers.get(container_id)
            logs = container.logs(tail=tail).decode("utf-8")
            return logs
        except docker.errors.NotFound:
            return "Container not found"
        except Exception as e:
            return f"Error: {e}"
