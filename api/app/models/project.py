from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    prompt = Column(Text, nullable=False)
    status = Column(String, default="draft")  # draft, forging, testing, deploying, completed, failed
    generated_code = Column(JSON, nullable=True)
    preview_url = Column(String, nullable=True)
    deployed_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)
    forked_from = Column(String, nullable=True)

    user = relationship("User", back_populates="projects")
