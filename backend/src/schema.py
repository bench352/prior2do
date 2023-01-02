"""Schemas for server"""

import uuid
from typing import Optional

import pendulum
from pydantic import BaseModel


def to_camel(text: str):
    return text[0] + text.title()[1:].replace("-", "").replace("_", "")


class RESTBase(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class User(RESTBase):
    username: str
    password: str


class UserPayload(RESTBase):
    password: str


class Task(RESTBase):
    id: uuid.UUID
    name: str
    due_date: Optional[pendulum.DateTime]
    est_hr: int
    planned_date: Optional[pendulum.DateTime]
    tag: str
    completed: bool


class TaskPayload(RESTBase):
    last_updated: int
    tasks: list[Task]
