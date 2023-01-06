"""Entrypoint for server"""

import fastapi
import fastapi.middleware.cors
import uvicorn
import exceptions
import routers.auth
import routers.tasks

description = """
The API server for Prior2do Sync, a backup and sync service for Prior2do app.
The API server is still **under development** and the API endpoints are subjected
to change due to feature or implementation updates.
"""

tags_metadata = [
    {
        "name": "Authenticate",
        "description": (
            "Authentication endpoints for Prior2do Sync. You can **login** or **signup** "
            "for your Prior2Do account, or **update/delete** your account information."
        ),
    },
    {
        "name": "Tasks",
        "description": (
            "Endpoints for managing your tasks on the Prior2do Sync server. "
            "You can **create/read/update/delete** your tasks with these endpoints."
        ),
    },
]

app = fastapi.FastAPI(
    title="Prior2Do Sync", description=description, version="0.1.0", openapi_tags=tags_metadata
)


@app.get("/")
async def root():
    return "prior2do-backend"


app.include_router(routers.auth.router, tags=["Authenticate"])
app.include_router(routers.tasks.router, tags=["Tasks"])


@app.exception_handler(exceptions.UserAuthenticationFail)
async def authentication_fail_handler(_: fastapi.Request, exc: exceptions.UserAuthenticationFail):
    return fastapi.responses.PlainTextResponse(status_code=401, content=str(exc))


app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0")
