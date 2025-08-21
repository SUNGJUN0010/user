# init_db.py
from backend.app import create_app
from backend.extensions import db

app = create_app()
with app.app_context():
    db.create_all()
    print("tables created")
