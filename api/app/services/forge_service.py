from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.agents.researcher import ResearcherAgent
from app.agents.coder import CoderAgent
from app.agents.tester import TesterAgent
from app.agents.deployer import DeployerAgent
from app.api.routes.projects import forge_statuses
import json


class ForgeService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.agents = {
            "researcher": ResearcherAgent(),
            "coder": CoderAgent(),
            "tester": TesterAgent(),
            "deployer": DeployerAgent(),
        }

    def update_status(self, project_id: str, status: str, agent: str, progress: int, log: str):
        if project_id in forge_statuses:
            forge_statuses[project_id].status = status
            forge_statuses[project_id].current_agent = agent
            forge_statuses[project_id].progress = progress
            forge_statuses[project_id].logs.append(log)

    async def run_forge(self, project: Project):
        project_id = project.id

        try:
            # Step 1: Research
            self.update_status(project_id, "forging", "researcher", 10, "Researcher: Starting research...")
            research_data = await self.agents["researcher"].run(project.prompt)
            self.update_status(project_id, "forging", "researcher", 25, f"Researcher: Found {len(research_data.get('components', []))} relevant components")

            # Step 2: Code Generation
            self.update_status(project_id, "forging", "coder", 30, "Coder: Generating application code...")
            generated_code = await self.agents["coder"].run(project.prompt, research_data)
            file_count = len(generated_code)
            self.update_status(project_id, "forging", "coder", 50, f"Coder: Generated {file_count} files")

            # Save generated code to project
            project.generated_code = generated_code
            project.status = "testing"
            await self.db.commit()
            self.update_status(project_id, "testing", "tester", 60, "Tester: Running tests in sandbox...")

            # Step 3: Testing
            test_results = await self.agents["tester"].run(generated_code)
            if test_results["passed"]:
                self.update_status(project_id, "testing", "tester", 75, "Tester: All tests passed!")
            else:
                self.update_status(project_id, "testing", "tester", 75, f"Tester: {len(test_results['failures'])} tests failed")

            # Step 4: Deployment preparation
            self.update_status(project_id, "deploying", "deployer", 85, "Deployer: Preparing deployment...")
            deploy_config = await self.agents["deployer"].run(generated_code)
            self.update_status(project_id, "deploying", "deployer", 95, "Deployer: Configuration complete")

            # Mark as completed
            project.status = "completed"
            project.preview_url = f"/preview/{project.id}"
            await self.db.commit()
            self.update_status(project_id, "completed", "deployer", 100, "Forge completed successfully!")

        except Exception as e:
            project.status = "failed"
            await self.db.commit()
            if project_id in forge_statuses:
                forge_statuses[project_id].status = "failed"
                forge_statuses[project_id].error = str(e)
                forge_statuses[project_id].logs.append(f"Error: {str(e)}")
