"""Schemas for server"""

import uuid
from typing import Optional, Generic, TypeVar

import pendulum
from pydantic import BaseModel

T = TypeVar("T")


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


class IdBasedResource(RESTBase):
    id: uuid.UUID


class IdNameBasedResource(IdBasedResource):
    name: str


class Task(IdNameBasedResource):
    class SubTask(IdNameBasedResource):
        completed: bool

    due_date: Optional[pendulum.DateTime]
    description: str
    estimated_hours: float
    completed: bool
    sub_tasks: list[SubTask]


class Tag(IdNameBasedResource):
    pass


class Quote(RESTBase):
    text: str
    author: str


class ResponsePayload(RESTBase, Generic[T]):
    last_updated: int
    data: T


class TasksReponse(ResponsePayload[list[Task]]):
    data: list[Task]


class TaskResponse(ResponsePayload[Task]):
    data: Task


class WorkSession(IdBasedResource):
    task_id: uuid.UUID
    date: pendulum.DateTime
    duration: float
