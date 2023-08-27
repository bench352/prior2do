"""Neo4j Client for Managing Tasks"""

import uuid

import exceptions
import neo4j_client.base
import neo4j_client.users
import schema


class Tasks(neo4j_client.base.BaseClient):
    async def get_tasks(self, username: str, task_name: str, limit: int = -1, offset: int = 0) -> schema.TasksReponse:
        user_attr = {"username": username}
        query = f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task)
                WITH t ORDER BY t.name
                WHERE t.name CONTAINS '{task_name}'
                RETURN t.name, t.id, t.description, t.completed, t.dueDate, t.estimatedHours, t.subTasks
                SKIP {offset}
                """
        if limit != -1:
            query += "\nLIMIT {limit}"
        async with self._neo4j_driver.session() as session:
            response = await session.run(query)
            result = await response.data()
            tasks = [schema.Task(**task) for task in result]
            return schema.TasksReponse(
                last_updated=await neo4j_client.users.Users().get_user_last_updated_timestamp(
                    username
                ),
                data=tasks,
            )

    async def get_task_by_id(self, username: str, task_id: uuid.UUID) -> schema.TaskResponse:
        user_attr = {"username": username}
        query = f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task{self._dict_to_attr({"id": task_id})})
                RETURN t
                """
        async with self._neo4j_driver.session() as session:
            response = await session.run(query)
            result = await response.data()
            if not result:
                raise exceptions.ResourceNotFound(f"Task with id {task_id} not found.")
            return schema.TaskResponse(
                last_updated=await neo4j_client.users.Users().get_user_last_updated_timestamp(username),
                data=schema.Task(**result[0]),
            )

    async def create_task(self, username: str, task: schema.Task):
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})
                MERGE (t:Task{self._dict_to_attr(task.dict(by_alias=True))})
                MERGE (u)-[:owns]->(t)
                """
            )
        await neo4j_client.users.Users().set_user_last_updated_timestamp(username)

    async def update_task(self, username: str, task: schema.Task):
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task)
                WHERE t.id='{task.id}'
                SET t += {self._dict_to_attr(task.dict(by_alias=True))}
                """
            )
        await neo4j_client.users.Users().set_user_last_updated_timestamp(username)

    async def delete_task(self, username: str, task_id: str):
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task)
                WHERE t.id='{task_id}'
                DETACH DELETE t
                """
            )

        await neo4j_client.users.Users().set_user_last_updated_timestamp(username)
