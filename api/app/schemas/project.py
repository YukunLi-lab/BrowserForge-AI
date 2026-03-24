from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Record, List


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    prompt: str


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    prompt: str
    status: str
    generated_code: Optional[Record[str, str]]
    preview_url: Optional[str]
    deployed_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: str
    is_public: bool
    forked_from: Optional[str]

    class Config:
        from_attributes = True


class ForgeStatus(BaseModel):
    status: str
    current_agent: Optional[str]
    progress: int
    logs: List[str]
    error: Optional[str]


class DeployResult(BaseModel):
    url: str
    provider: str
