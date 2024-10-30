import httpx
import json

class TryExceptClient(httpx.AsyncClient):
    def __init__(self, base_url) -> None:
        super().__init__()
        self.base_url=base_url

    async def request(self, method, url, print_response=False, *args, **kwargs):
        try:
            response = await super().request(method, url, *args, **kwargs)
            data = response.raise_for_status().json()

        except httpx.RequestError as exc:
            print(f"An error occurred while requesting {exc.request.url!r}.")
            
        except httpx.HTTPStatusError as exc:
            data = self.check_api_success(exc.response)

        except httpx.HTTPError as exc:
            print(f"HTTP Exception for {exc.request.url} - {exc}")
            print(exc.request.headers)

        if (print_response==True):
            print(response.headers)
            print(json.dumps(data, indent=2))
        return response.json()
    
    def check_api_success(self, response):
        if response.status_code in (400, 404, 405, 422):
            print(str(response.status_code)+":")
            try: #some responses are in a dict
                print(json.dumps(response.json(), indent=2))
            except: #others are not and just the content should be printed
                print(response.content)
            response.raise_for_status()
        
        elif response.status_code == 307:
            print("307: Temporary Redirect")
            print("This is likely due to the inclusion or omission of a slash at the end of the url")
            print(json.dumps(response.json(), indent=2))
            response.raise_for_status()

        else:
            return response.json()