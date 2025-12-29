# Template AI

Production-ready template for building AI applications with intelligent agents.

## Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS 4 + Biome |
| **Backend** | Agno Framework + FastAPI + AgentOS |
| **Database** | PostgreSQL 16 + pgvector |
| **API Docs** | [Scalar](https://scalar.com/) |
| **Runtime** | Bun (frontend) + Python 3.11+ (backend) |
| **Container** | Docker Compose |

## Features

- Pre-built AI agents with web search and memory
- Multi-agent teams for complex tasks
- Real-time streaming responses (SSE)
- Beautiful chat UI with agent selector
- Modern API documentation with Scalar
- Production-ready Docker configuration

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Bun](https://bun.sh/) (for frontend)
- [Python 3.11+](https://www.python.org/) (for backend)
- OpenAI API Key

### 1. Setup

```bash
# Copy environment variables
cp .env.example .env

# Edit .env and add your OPENAI_API_KEY
```

### 2. Start with Docker

```bash
# Start all services
docker compose -f infra/docker/docker-compose.yml up -d

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f
```

### 3. Access

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Chat UI** | http://localhost:3000/chat |
| **API Docs (Scalar)** | http://localhost:8080/scalar |
| **API Docs (Swagger)** | http://localhost:8080/docs |
| **API** | http://localhost:8080 |

---

## Project Structure

```
template_ai/
├── apps/
│   ├── api/                    # Backend (Agno + FastAPI)
│   │   ├── agents/             # Agent definitions
│   │   │   ├── web_agent.py    # Web search agent
│   │   │   └── agno_assist.py  # Agno docs assistant
│   │   ├── teams/              # Multi-agent teams
│   │   ├── workflows/          # Complex workflows
│   │   ├── app/
│   │   │   └── main.py         # AgentOS entry point
│   │   └── compose.yaml        # API-only Docker
│   │
│   └── web/                    # Frontend (Next.js)
│       └── src/
│           ├── app/
│           │   ├── page.tsx        # Landing page
│           │   └── chat/page.tsx   # Chat interface
│           ├── components/
│           │   └── chat/           # Chat components
│           ├── hooks/
│           │   ├── use-chat.ts     # Chat hook with streaming
│           │   └── use-agents.ts   # Agents hook
│           └── lib/
│               └── api/client.ts   # API client
│
├── infra/
│   └── docker/
│       └── docker-compose.yml  # Full stack Docker
│
├── .env.example
└── README.md
```

---

## API Documentation

The API documentation is powered by [Scalar](https://scalar.com/).

| URL | Description |
|-----|-------------|
| `/scalar` | **Scalar** - Modern API Reference (recommended) |
| `/docs` | Swagger UI |
| `/redoc` | ReDoc |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/agents` | GET | List available agents |
| `/v1/agents/{id}/run` | POST | Execute an agent |
| `/v1/teams` | GET | List available teams |
| `/v1/teams/{id}/run` | POST | Execute a team |
| `/v1/workflows` | GET | List available workflows |
| `/health` | GET | Health check |

---

## Included Agents

| Agent ID | Name | Description |
|----------|------|-------------|
| `web-search-agent` | Web Search Agent | Searches the web with DuckDuckGo |
| `agno-assist` | Agno Assistant | Helps with Agno documentation |

## Included Teams

| Team | Description |
|------|-------------|
| `multilingual_team` | Multi-language support |
| `reasoning_research_team` | Research and analysis |

---

## Local Development

### Backend Only

```bash
cd apps/api

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Start PostgreSQL
docker compose up pgvector -d

# Run API
uvicorn app.main:app --reload --port 8080
```

### Frontend Only

```bash
cd apps/web

# Install dependencies
bun install

# Run development server
bun run dev
```

---

## Scripts

```bash
# Docker commands
bun run dev              # Start all with Docker
bun run docker:up        # Start services
bun run docker:down      # Stop services
bun run docker:logs      # View logs
bun run docker:build     # Rebuild images
bun run docker:restart   # Restart services

# Local development
bun run dev:web          # Start frontend only
bun run dev:api          # Start backend only
bun run build            # Build frontend
bun run lint             # Lint frontend
```

---

## Adding New Features

### New Agent

1. Create file in `apps/api/agents/`:

```python
# apps/api/agents/my_agent.py
from agno.agent import Agent
from agno.models.openai import OpenAIChat

my_agent = Agent(
    id="my-agent",
    name="My Custom Agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    instructions=["Be helpful and concise."],
    markdown=True,
)
```

2. Register in `apps/api/app/main.py`:

```python
from agents.my_agent import my_agent

agent_os = AgentOS(
    agents=[web_agent, agno_assist, my_agent],  # Add here
    ...
)
```

3. Restart the API.

### New Frontend Page

Create a new folder in `apps/web/src/app/`:

```bash
mkdir apps/web/src/app/my-page
touch apps/web/src/app/my-page/page.tsx
```

Next.js will auto-detect the new route.

---

## Working with This Template

### Development Workflow

1. **Start services**: `docker compose -f infra/docker/docker-compose.yml up -d`
2. **Make changes**: Edit files in `apps/api/` or `apps/web/`
3. **Hot reload**: Both frontend and backend auto-reload on changes
4. **Test**: Visit http://localhost:3000/chat to test agents
5. **Stop**: `docker compose -f infra/docker/docker-compose.yml down`

### Key Files to Modify

| Purpose | File |
|---------|------|
| Add agents | `apps/api/agents/` |
| Add teams | `apps/api/teams/` |
| Add workflows | `apps/api/workflows/` |
| Modify chat UI | `apps/web/src/components/chat/` |
| Add pages | `apps/web/src/app/` |
| Configure API client | `apps/web/src/lib/api/client.ts` |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key | No |
| `DB_USER` | Database user | Yes (default: ai) |
| `DB_PASSWORD` | Database password | Yes (default: ai) |
| `DB_NAME` | Database name | Yes (default: ai) |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes (default: http://localhost:8080) |

### Customization Tips

1. **Change default agent**: Edit `selectedAgentId` in `chat-container.tsx`
2. **Add new tools**: Create functions in `apps/api/` and add to agents
3. **Modify UI theme**: Edit Tailwind classes in components
4. **Add authentication**: Implement in `apps/web/src/app/` with middleware

---

## Deployment

### Vercel (Frontend) + Railway (Backend)

1. Deploy `apps/web` to Vercel
2. Deploy `apps/api` to Railway with PostgreSQL
3. Set `NEXT_PUBLIC_API_URL` in Vercel to Railway URL

### Docker (Self-hosted)

```bash
# Build production images
docker compose -f infra/docker/docker-compose.yml build

# Run in production
docker compose -f infra/docker/docker-compose.yml up -d
```

---

## Troubleshooting

### Frontend can't connect to backend

1. Check CORS is configured in `apps/api/app/main.py`
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Ensure backend is running on port 8080

### Agents not loading

1. Check `OPENAI_API_KEY` is set in `.env`
2. Verify PostgreSQL is running
3. Check backend logs: `docker compose logs api`

### Database connection issues

1. Ensure PostgreSQL container is healthy
2. Check `DB_*` environment variables
3. Try: `docker compose restart postgres`

---

## License

See [LICENSE](./apps/api/LICENSE) for details.
