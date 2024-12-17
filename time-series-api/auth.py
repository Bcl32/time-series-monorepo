from fastapi_azure_auth.auth import SingleTenantAzureAuthorizationCodeBearer

from config import Authentication
settings=Authentication()

azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=settings.BACK_END_CLIENT_ID,
    tenant_id=settings.TENANT_ID,
    scopes=settings.SCOPES,
      allow_guest_users=True,
)
