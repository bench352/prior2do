"""Authentication service"""

import bcrypt
import fastapi
import fastapi.security
from jose import JWTError, jwt
import env
import exceptions
import neo4j_client.users

SECRET_KEY = env.SECRET_KEY
oauth2_scheme = fastapi.security.OAuth2PasswordBearer(tokenUrl="login")

db_client = neo4j_client.users.Users()


async def signup(username: str, password: str):
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf-8")
    await db_client.signup(username, hashed_password)


async def authenticate_user(username: str, password: str) -> bool:
    try:
        user_hashed_password = await db_client.get_user_password(username)
    except exceptions.UserNotFound:
        return False
    return bcrypt.checkpw(password.encode(), user_hashed_password.encode())


async def update_user(username: str, new_password: str):
    hashed_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode("utf-8")
    await db_client.update_user(username, hashed_password)


def generate_jwt_token(username: str, password: str) -> str:
    payload = {"username": username, "password": password}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


async def get_username_from_token(token: str = fastapi.Depends(oauth2_scheme)) -> str:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except JWTError as e:
        raise exceptions.UserAuthenticationFail("Token is not valid") from e

    try:
        user_is_authenticated = await authenticate_user(
            decoded_token["username"], decoded_token["password"]
        )
    except exceptions.UserNotFound as e:
        raise exceptions.UserAuthenticationFail("Token is not valid") from e
    if not user_is_authenticated:
        raise exceptions.UserAuthenticationFail("Token is not valid")

    return decoded_token["username"]
