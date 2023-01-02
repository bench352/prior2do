"""Entrypoint for server"""

import fastapi
import fastapi.middleware.cors
import uvicorn
import exceptions
import routers.auth
import routers.tasks

app = fastapi.FastAPI()


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
