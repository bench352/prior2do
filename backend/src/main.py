import fastapi
import uvicorn
import routers.auth
import routers.tasks
import exceptions
import fastapi.middleware.cors

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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app")
