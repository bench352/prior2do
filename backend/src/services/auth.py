import bcrypt
import neo4j_client.users
import env
from jose import jwt, JWTError
import fastapi
import fastapi.security
import exceptions

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


def generate_jwt_token(username: str, password: str) -> str:
    payload = {"username": username, "password": password}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


async def get_username_from_token(token: str = fastapi.Depends(oauth2_scheme)) -> str:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise exceptions.UserAuthenticationFail("Token is not valid")

    try:
        user_is_authenticated = await authenticate_user(decoded_token["username"], decoded_token["password"])
    except exceptions.UserNotFound:
        raise exceptions.UserAuthenticationFail("Token is not valid")
    if not user_is_authenticated:
        raise exceptions.UserAuthenticationFail("Token is not valid")

    return decoded_token["username"]
