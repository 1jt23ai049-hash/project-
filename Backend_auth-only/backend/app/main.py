"""
Trimmed entrypoint — only wires up the auth router (register / login /
change-password / forgot-password / reset-password), for testing the
Signup, Login, Forgot Password, and Reset Password pages in isolation.

The full app (backend/app/main.py in the original project) also wires up
products, batches, overview, qr, verify, analytics, billing, plan, and
admin routers — omitted here since they're out of scope for this test
pass. Add them back (and their schema/router/migration files) if the
scope grows.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth_router import router as auth_router
from .config import settings
from .db import connect_db, disconnect_db

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")

app = FastAPI(title="AgriQR v2 API — auth-only test build", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await connect_db()


@app.on_event("shutdown")
async def on_shutdown():
    await disconnect_db()


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(auth_router)
