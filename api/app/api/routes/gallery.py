from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project
from app.schemas.user import UserResponse
from typing import Optional

router = APIRouter()


class TemplateResponse:
    def __init__(self, project: Project, author: User):
        self.id = project.id
        self.name = project.name
        self.description = project.description
        self.prompt = project.prompt
        self.thumbnail_url = None
        self.created_at = project.created_at
        self.author = UserResponse.model_validate(author)
        self.forks_count = 0


@router.get("")
async def list_gallery(token: Optional[str] = None):
    # Return empty list for demo (in production, query public projects)
    return []


@router.get("/{template_id}")
async def get_template(template_id: str):
    # Return empty for demo
    raise HTTPException(status_code=404, detail="Template not found")


@router.post("/{template_id}/fork")
async def fork_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Template not found")
