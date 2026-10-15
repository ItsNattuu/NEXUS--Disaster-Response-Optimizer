
FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN gcc main.c -o nexus -std=c11 -Wall -Wextra -lm

ENV NEXUS_EXECUTABLE=/app/nexus

CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-10000}"]
