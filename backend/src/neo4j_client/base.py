import neo4j
import env


class BaseClient:
    _neo4j_driver = neo4j.AsyncGraphDatabase.driver(
        f"neo4j://{env.NEO4J_HOST}:{env.NEO4J_PORT}", auth=(env.NEO4J_USERNAME, env.NEO4J_PASSWORD)
    )

    def _dict_to_attr(self, attr_dict: dict):
        return "{" + ",".join([f'{key}:"{value}"' for key, value in attr_dict.items()]) + "}"
