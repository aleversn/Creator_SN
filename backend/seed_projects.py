import asyncio

from tortoise import Tortoise

from api.controllers.project import seed_default_projects
from api.models.db_models import ProjectDBModel


async def main():
    await Tortoise.init(
        db_url="sqlite://./db/db.sqlite3",
        modules={"models": ["api.models.db_models"]},
    )
    await Tortoise.generate_schemas(safe=True)
    await seed_default_projects()
    items = await ProjectDBModel.filter(
        id__in=["fabulous", "mathfx", "vfluent3", "powereditor"]
    ).values("id", "name", "favor", "audit_status")
    print(items)
    await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(main())
