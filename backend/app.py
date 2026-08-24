import asyncio
import contextlib
import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from api.controllers.member import router as member_router
from api.controllers.product import router as product_router
from api.controllers.resume import router as resume_router
from api.controllers.user import router as user_router
from api.models.body import response_body
from api.models.db_backup import create_monthly_db_backup


BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / 'api' / 'app_config.json'
with CONFIG_PATH.open(encoding='utf-8') as config_file:
    app_config = json.load(config_file)

app = FastAPI(title='Creator SN Backend', version='0.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_config.get('allow_origins', ['*']),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

DB_DIR = BASE_DIR / 'db'
DB_DIR.mkdir(parents=True, exist_ok=True)
BACKUP_CHECK_SECONDS = 30 * 24 * 60 * 60
backup_task = None

register_tortoise(
    app,
    db_url='sqlite://./db/db.sqlite3',
    modules={'models': ['api.models.db_models']},
    generate_schemas=True,
    add_exception_handlers=True,
)


async def periodic_db_backup():
    while True:
        await asyncio.sleep(BACKUP_CHECK_SECONDS)
        try:
            await asyncio.to_thread(create_monthly_db_backup)
        except Exception as exc:
            print(f'Database backup failed: {exc}')


@app.on_event('startup')
async def startup():
    global backup_task
    backup_task = asyncio.create_task(periodic_db_backup())


@app.on_event('shutdown')
async def shutdown():
    if backup_task is not None:
        backup_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await backup_task


app.include_router(user_router)
app.include_router(member_router)
app.include_router(product_router)
app.include_router(resume_router)


@app.get('/', operation_id='Home')
def home():
    return response_body(message='Creator SN Backend is running...')()
