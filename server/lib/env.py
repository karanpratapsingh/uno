import os

ENVIRONMENT = os.getenv("ENVIRONMENT") or 'development'
REDIS_URL = os.getenv("REDIS_URL") or 'redis://localhost:6379'
WEB_URL = os.getenv("WEB_URL") or 'http://localhost:3000'
