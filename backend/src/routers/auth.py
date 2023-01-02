"""Authentication router"""

import fastapi
import fastapi.security
import schema
import services.auth
import exceptions
import neo4j_client.users

router = fastapi.APIRouter()
client = neo4j_client


@router.post("/login")
async def login(form_data: fastapi.security.OAuth2PasswordRequestForm = fastapi.Depends()):
    if not await services.auth.authenticate_user(form_data.username, form_data.password):
        raise exceptions.UserAuthenticationFail("Authentication failed!")
    return {
        "access_token": services.auth.generate_jwt_token(form_data.username, form_data.password),
        "token_type": "bearer",
    }


@router.post("/signup")
async def signup(user: schema.User):
    await services.auth.signup(user.username, user.password)
    return "signup success"


@router.put("/users")
async def update_user(
    user_data: schema.UserPayload,
    username: str = fastapi.Depends(services.auth.get_username_from_token),
):
    await services.auth.update_user(username, user_data.password)


@router.delete("/users")
async def delete_user(username: str = fastapi.Depends(services.auth.get_username_from_token)):
    await neo4j_client.users.Users().delete_user(username)
