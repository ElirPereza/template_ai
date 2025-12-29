"""AgentOS with Scalar API Documentation"""

import os
from pathlib import Path

from agno.os import AgentOS
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from agents.agno_assist import agno_assist
from agents.web_agent import web_agent
from teams.multilingual_team import multilingual_team
from teams.reasoning_finance_team import reasoning_research_team
from workflows.investment_workflow import investment_workflow
from workflows.research_workflow import research_workflow

os_config_path = str(Path(__file__).parent.joinpath("config.yaml"))

# Create the AgentOS
agent_os = AgentOS(
    id="agentos-docker",
    agents=[web_agent, agno_assist],
    teams=[multilingual_team, reasoning_research_team],
    workflows=[investment_workflow, research_workflow],
    # Configuration for the AgentOS
    config=os_config_path,
)
app = agent_os.get_app()

# CORS Configuration - Allow frontend to communicate with backend
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Scalar API Documentation (beautiful alternative to Swagger/ReDoc)
@app.get("/scalar", include_in_schema=False)
async def scalar_docs():
    """Scalar API Reference - Modern API Documentation"""
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Template AI - API Documentation",
    )


if __name__ == "__main__":
    # Serve the application
    agent_os.serve(app="main:app", reload=True)
