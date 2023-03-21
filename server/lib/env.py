import os

ENVIRONMENT = os.getenv("ENVIRONMENT") or 'development'
REDIS_HOST = os.getenv("REDIS_HOST") or 'localhost'