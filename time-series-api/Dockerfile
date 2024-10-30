FROM python:3.10

WORKDIR /app

COPY ./time-series-api/requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./time-series-api/ /app
COPY ./python-modules/ /app/python-modules

#CMD ["fastapi", "dev", "/app/main.py", "--reload", "--host", "0.0.0.0", "--port", "8000"]
CMD ["uvicorn", "main:app", "--reload", "--reload-exclude",  "*.txt", "--host", "0.0.0.0", "--port", "8000"]