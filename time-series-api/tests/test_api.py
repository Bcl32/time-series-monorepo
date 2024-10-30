from fastapi import status
import pytest

pytestmark = pytest.mark.asyncio #async functions fix https://quantlane.com/blog/make-sure-asyncio-tests-always-run/

class TestResultsAPI:
    """Test cases for the results API."""

    async def test_create_result(self, client):
        response = await client.post("/datafeeds/results", json={"name": "Carrot"})
        assert response.status_code == status.HTTP_201_CREATED
        pk = response.json().get("pk")
        assert pk is not None

        response = await client.get("/datafeeds/results")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 1
        assert response.json()[0]["pk"] == pk

    async def test_list_results(self, client):
        for n in range(3):
            await client.post("/datafeeds/results", json={"name": str(n)})

        response = await client.get("/datafeeds/results")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 3

    async def test_get_result(self, client):
        response = await client.post("/datafeeds/results", json={"name": "Sugar"})
        assert response.status_code == status.HTTP_201_CREATED
        pk = response.json()["pk"]
        assert pk is not None

        response = await client.get(f"/datafeeds/results/{pk}")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["pk"] == pk


class TestDatafeedsAPI:
    """Test cases for the datafeeds API."""

    async def test_create_datafeed(self, client):
        response = await client.post("/datafeeds/results", json={"name": "Sugar"})

        response = await client.post(
            "/datafeeds/datafeeds",
            json={
                "name": "datafeed of Swiftness",
                "results": [response.json()["pk"]],
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        pk = response.json().get("pk")
        assert pk is not None

        response = await client.get("/datafeeds/datafeeds")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 1
        assert response.json()[0]["pk"] == pk
        assert response.json()[0]["results"][0]["name"] == "Sugar"

    async def test_list_datafeeds(self, client):
        response = await client.post("/datafeeds/results", json={"name": "Sugar"})
        result_pk = response.json()["pk"]

        for n in range(3):
            await client.post(
                "/datafeeds/datafeeds",
                json={"name": str(n), "results": [result_pk]},
            )

        response = await client.get("/datafeeds/datafeeds")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 3

    async def test_get_datafeed(self, client):
        response = await client.post("/datafeeds/results", json={"name": "Sugar"})

        response = await client.post(
            "/datafeeds/datafeeds",
            json={
                "name": "datafeed of Swiftness",
                "results": [response.json()["pk"]],
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        pk = response.json().get("pk")
        assert pk is not None

        response = await client.get(f"/datafeeds/datafeeds/{pk}")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["pk"] == pk