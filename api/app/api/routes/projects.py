from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse, ForgeStatus, DeployResult
from app.services.forge_service import ForgeService
import json

router = APIRouter()

# In-memory status store (in production, use Redis)
forge_statuses: dict[str, ForgeStatus] = {}


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project)
        .where(Project.user_id == current_user.id)
        .order_by(Project.updated_at.desc())
    )
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p) for p in projects]


@router.post("", response_model=ProjectResponse)
async def create_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = Project(
        name=data.name,
        description=data.description,
        prompt=data.prompt,
        user_id=current_user.id,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()

    return {"message": "Project deleted"}


@router.post("/{project_id}/forge")
async def start_forge(
    project_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update status
    project.status = "forging"
    await db.commit()

    # Initialize forge status
    forge_statuses[project_id] = ForgeStatus(
        status="forging",
        current_agent="researcher",
        progress=0,
        logs=["Starting forge pipeline..."],
        error=None,
    )

    # Run forge in background
    forge_service = ForgeService(db)
    background_tasks.add_task(forge_service.run_forge, project)

    return {"message": "Forge started", "project_id": project_id}


@router.get("/{project_id}/status", response_model=ForgeStatus)
async def get_forge_status(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify access
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    return forge_statuses.get(
        project_id,
        ForgeStatus(status="draft", current_agent=None, progress=0, logs=[], error=None),
    )


@router.post("/{project_id}/deploy", response_model=DeployResult)
async def deploy_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != "completed":
        raise HTTPException(status_code=400, detail="Project must be completed before deploying")

    # For demo, return a mock URL
    deploy_url = f"https://{project.name.lower().replace(' ', '-')}.vercel.app"

    project.deployed_url = deploy_url
    project.status = "deploying"
    await db.commit()

    # In production, trigger actual deployment
    project.deployed_url = deploy_url
    project.status = "completed"
    await db.commit()

    return DeployResult(url=deploy_url, provider="vercel")
