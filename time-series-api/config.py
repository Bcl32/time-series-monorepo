from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic.types import SecretStr
from pydantic import AnyHttpUrl, computed_field
from dotenv import load_dotenv
import os

if "CONTAINER_PATH" in os.environ: #var is defined in docker container
    ROOT_PATH=os.environ.get('CONTAINER_PATH') 
else:
    load_dotenv() #if not load the definition from .env file
    ROOT_PATH=os.environ.get('ROOT_PATH') 

INPUT_FILES = './static/input_files'

NAB_ASSETS = Path(ROOT_PATH) / "static" / "nab"

class AsyncPostgres(BaseSettings):
    model_config = SettingsConfigDict(env_file=Path(ROOT_PATH) / ".env", env_prefix='db_', extra='ignore',)
    PORT: int
    NETLOC: str
    NAME: str
    USER: str
    HOST: str
    PASSWORD: str
    
    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        return f'postgresql+asyncpg://{self.USER}:{self.PASSWORD}@{self.NETLOC}:{self.PORT}/{self.NAME}'

class Authentication(BaseSettings):
    model_config = SettingsConfigDict(env_file=Path(ROOT_PATH) / ".env", env_prefix='auth_', extra='ignore',)
    FRONT_END_CLIENT_ID: str
    BACK_END_CLIENT_ID: str
    TENANT_ID: str
    SCOPE_DESCRIPTION: str

    @computed_field
    @property
    def SCOPE_NAME(self) -> str:
        return f'api://{self.BACK_END_CLIENT_ID}/{self.SCOPE_DESCRIPTION}'

    @computed_field
    @property
    def SCOPES(self) -> dict:
        return {
            self.SCOPE_NAME: self.SCOPE_DESCRIPTION,
        }