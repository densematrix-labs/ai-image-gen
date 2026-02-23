# AI Image Gen

Free AI image generator - Playground AI alternative. Generate stunning images from text with DALL-E and other state-of-the-art models.

## Features

- 🎨 **Text-to-Image** - Transform your ideas into beautiful images
- 🎭 **Multiple Styles** - Realistic, Anime, Digital Art, Oil Painting, and more
- ⚡ **Fast Generation** - Optimized pipeline for quick results
- 💎 **HD Quality** - High resolution downloads without watermarks
- 🌍 **7 Languages** - EN, ZH, JA, DE, FR, KO, ES
- 💳 **Pay-as-you-go** - No subscriptions, buy credits when you need them

## Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Python FastAPI
- **AI**: DALL-E 3 via LLM Proxy
- **Payment**: Creem MoR
- **Database**: SQLite
- **Deployment**: Docker

## Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Testing

```bash
# Backend
cd backend
pytest --cov=app --cov-fail-under=95

# Frontend
cd frontend
npm run test:coverage
```

## Deployment

```bash
# Build and start containers
docker compose up -d --build

# Check status
docker compose ps
```

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
