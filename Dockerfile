FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY media-downloader-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY media-downloader-backend/app.py .
COPY media-downloader-backend/templates ./templates
COPY media-downloader-backend/static ./static

EXPOSE 8899
ENV HOST=0.0.0.0
CMD ["python", "app.py"]
