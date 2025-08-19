from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, bcrypt, jwt
from .routes import auth as auth_routes
from .routes import users as users_routes


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS
    CORS(app, supports_credentials=True, origins=app.config["CORS_ALLOW_ORIGINS"])

    # Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Blueprints
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(users_routes.bp)

    @app.get("/healthz")
    def healthz():
        return {"status": "ok"}

    # 초기 테이블 생성(MVP용 — 운영에선 마이그레이션 도구 사용 권장)
    with app.app_context():
        db.create_all()

    return app
