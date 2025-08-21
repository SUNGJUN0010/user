# Community User (Flask + React + MySQL/RDS)

## Quick Start (Amazon Linux 2023)
### Backend
```bash
sudo dnf update -y
sudo dnf install -y python3.9 python3.9-pip git
python3.9 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
export FLASK_APP=backend/wsgi:app
flask run --host=0.0.0.0 --port=5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm i
npm run dev
```

## API
See `backend/routes/*.py` for endpoints.
