import neo4j_client.base
import schema
import pendulum
import neo4j_client.users


class Tasks(neo4j_client.base.BaseClient):
    async def get_tasks(self, username: str) -> schema.TaskPayload:
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            response = await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task) 
                RETURN t.name AS name, t.id AS id, t.dueDate AS dueDate, t.estHr AS estHr, 
                t.plannedDate AS plannedDate, t.tag AS tag, t.completed AS completed
                """
            )
            result = await response.values()
            tasks = [
                schema.Task(
                    name=task[0],
                    id=task[1],
                    due_date=pendulum.parse(task[2]) if task[2] != "None" else None,
                    est_hr=int(task[3]),
                    planned_date=pendulum.parse(task[4]) if task[4] != "None" else None,
                    tag=task[5],
                    completed=task[6],
                )
                for task in result
            ]
            return schema.TaskPayload(
                last_updated=await neo4j_client.users.Users().get_user_last_updated_timestamp(username), tasks=tasks
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

    async def update_task(self, username: str, task: schema.Task):  # TODO Error handling of no updated task
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

    async def delete_task(self, username: str, id: str):  # TODO Error handling of no task deleted
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task)
                WHERE t.id='{id}'
                DETACH DELETE t
                """
            )
        await neo4j_client.users.Users().set_user_last_updated_timestamp(username)

    async def delete_all_tasks(self, username: str):
        async with self._neo4j_driver.session() as session:
            user_attr = {"username": username}
            await session.run(
                f"""
                MATCH (u:User{self._dict_to_attr(user_attr)})-[:owns]->(t:Task)
                DETACH DELETE t
                """
            )
        await neo4j_client.users.Users().set_user_last_updated_timestamp(username)
