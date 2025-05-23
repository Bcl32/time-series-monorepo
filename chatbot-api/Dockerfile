FROM python:3.10-slim

WORKDIR /app

COPY ./chatbot-api/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./chatbot-api/ /app
COPY ./python-modules/ /app/python-modules

EXPOSE 8000

CMD ["bash"]