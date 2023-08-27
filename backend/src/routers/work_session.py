from typing import Optional

import fastapi

import schema
import services.auth

router = fastapi.APIRouter()


@router.get("/workSessions", summary="Get Work Sessions")
async def get_work_sessions(sername: str = fastapi.Depends(services.auth.get_username_from_token),
                            task_id: Optional[str] = fastapi.Query(alias="taskId", default=...,
                                                                   description="Filter work sessions by task ID")):
    pass


@router.get("/workSessions/{id}", summary="Get Work Session By ID")
async def get_work_session_by_id(username: str = fastapi.Depends(services.auth.get_username_from_token),
                                 work_session_id: str = fastapi.Path(alias="id")):
    pass


@router.post("/workSessions", summary="Create Work Sessions (Support bulk create)")
async def create_work_sessions(work_sessions: list[schema.WorkSession],
                               username: str = fastapi.Depends(services.auth.get_username_from_token)):
    pass


@router.put("/workSessions", summary="Update Work Session (Support bulk update)")
async def update_work_sessions(work_sessions: list[schema.WorkSession],
                               username: str = fastapi.Depends(services.auth.get_username_from_token)):
    pass


@router.delete("/workSessions/{id}", summary="Delete Work Session By ID")
async def delete_work_session(work_session_id: str = fastapi.Path(alias="id"),
                              username: str = fastapi.Depends(services.auth.get_username_from_token)):
    pass
