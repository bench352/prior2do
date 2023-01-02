import fastapi
import services.auth
import schema
import neo4j_client.tasks

router = fastapi.APIRouter()
client = neo4j_client.tasks.Tasks()


@router.get("/tasks")
async def get_tasks(username: str = fastapi.Depends(services.auth.get_username_from_token)) -> schema.TaskPayload:
    return await client.get_tasks(username)


@router.post("/tasks", status_code=fastapi.status.HTTP_201_CREATED)
async def create_task(task: schema.Task, username: str = fastapi.Depends(services.auth.get_username_from_token)):
    await client.create_task(username, task)


@router.put("/tasks")
async def update_task(task: schema.Task, username: str = fastapi.Depends(services.auth.get_username_from_token)):
    await client.update_task(username, task)


@router.delete("/tasks/{id}")
async def delete_task(id: str, username: str = fastapi.Depends(services.auth.get_username_from_token)):
    await client.delete_task(username, id)
