import exceptions
import neo4j_client.base
import neo4j.exceptions
import neo4j_client.tasks
import pendulum


class Users(neo4j_client.base.BaseClient):
    async def signup(self, username: str, hashed_password: str):
        async with self._neo4j_driver.session() as session:
            response = await session.run(f"MATCH (u:User) WHERE u.username='{username}' RETURN u.username")
            result = await response.value()
            if len(result) > 0:
                raise exceptions.UserAlreadyExists(f'User "{username}" already existed')
            user_attr = {"username": username, "password": hashed_password, "lastUpdated": 0}
            await session.run(f"MERGE (u:User{self._dict_to_attr(user_attr)})")

    async def get_user_password(self, username: str) -> str:
        async with self._neo4j_driver.session() as session:
            response = await session.run(f"MATCH(u:User) WHERE u.username='{username}' RETURN u.password as password")
            try:
                single_result = await response.single(strict=True)
            except neo4j.exceptions.ResultNotSingleError as e:
                raise exceptions.UserNotFound(f'User "{username}" not found') from e
            return single_result["password"]

    async def delete_user(self, username: str):
        await neo4j_client.tasks.Tasks().delete_all_tasks(username)
        async with self._neo4j_driver.session() as session:
            await session.run(f"MATCH(u:User) WHERE u.username='{username}' DELETE u")

    async def get_user_last_updated_timestamp(self, username: str) -> int:
        async with self._neo4j_driver.session() as session:
            response = await session.run(f"MATCH(u:User) WHERE u.username='{username}' RETURN u.lastUpdated")
            result = await response.single(strict=True)
            return int(result[0])

    async def set_user_last_updated_timestamp(self, username: str) -> int:
        async with self._neo4j_driver.session() as session:
            await session.run(
                f"MATCH(u:User) WHERE u.username='{username}' SET u.lastUpdated = '{int(pendulum.now().timestamp())}'"
            )
