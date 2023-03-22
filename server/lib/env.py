import os

ENVIRONMENT = os.getenv("ENVIRONMENT") or 'development'
REDIS_URL = os.getenv("REDIS_URL") or 'redis://localhost:6379'