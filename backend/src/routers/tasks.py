"""Tasks router"""

import uuid

import fastapi

import neo4j_client.tasks
import schema
import services.auth

router = fastapi.APIRouter()
client = neo4j_client.tasks.Tasks()


@router.get("/tasks", summary="Get Tasks")
async def get_tasks(
        username: str = fastapi.Depends(services.auth.get_username_from_token),
        name: str = fastapi.Query(
            description="Search string for filtering task by task name. Return tasks with name that contains `name`.",
            default=""),
        limit: int = fastapi.Query(-1, description="Limit the number of tasks returned.", ge=-1),
        offset: int = fastapi.Query(0, description="Offset the returned tasks by `offset`.", ge=0)
) -> schema.TasksReponse:
    return await client.get_tasks(username, name, limit, offset)


@router.get("/tasks/{id}", summary="Get Task By ID")
async def get_task_by_id(
        username: str = fastapi.Depends(services.auth.get_username_from_token),
        task_id: uuid.UUID = fastapi.Path(alias="id")
) -> schema.TaskResponse:
    return await client.get_task_by_id(username, task_id)


@router.post("/tasks", description="Create Tasks (Support bulk create)", status_code=fastapi.status.HTTP_201_CREATED)
async def create_tasks(
        tasks: list[schema.Task], username: str = fastapi.Depends(services.auth.get_username_from_token)
):
    for task in tasks:
        await client.create_task(username, task)


@router.put("/tasks", summary="Update Task By ID")
async def update_tasks(
        tasks: list[schema.Task], username: str = fastapi.Depends(services.auth.get_username_from_token)
):
    for task in tasks:
        await client.update_task(username, task)


@router.delete("/tasks/{id}", summary="Delete Task By ID")
async def delete_task(
        task_id: str = fastapi.Path(alias="id"),
        username: str = fastapi.Depends(services.auth.get_username_from_token),
):
    await client.delete_task(username, task_id)
