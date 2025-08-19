from __future__ import annotations
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app


def generate_reset_token(email: str) -> str:
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])  # 앱 시크릿 기반
    return s.dumps(email)


def verify_reset_token(token: str, max_age_seconds: int) -> str | None:
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = s.loads(token, max_age=max_age_seconds)
        return email
    except (BadSignature, SignatureExpired):
        return None
