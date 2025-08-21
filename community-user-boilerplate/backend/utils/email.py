from flask import current_app

# 실제 메일 발송 대신 콘솔 로깅/DB 저장으로 대체(MVP)

def send_password_reset_email(to_email: str, reset_url: str):
    current_app.logger.info(f"[RESET EMAIL] to={to_email} url={reset_url}")
