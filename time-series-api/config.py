from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic.types import SecretStr
from dotenv import load_dotenv
import os

load_dotenv()

ROOT_PATH=os.environ.get('ROOT_PATH') 

INPUT_FILES = './static/input_files'

NAB_ASSETS = Path(ROOT_PATH) / "static" / "nab"

class AsyncPostgresSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix='db_', extra='ignore',)
    PORT: int
    NETLOC: str
    NAME: str
    USER: str
    HOST: str
    PASSWORD: str

database_settings = AsyncPostgresSettings(_env_file=Path(ROOT_PATH) / ".env")
DATABASE_URL="postgresql+asyncpg://{USER}:{PASSWORD}@{NETLOC}:{PORT}/{NAME}".format(**database_settings.dict())