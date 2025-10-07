# AI Service

A FastAPI-based AI service that provides LLM capabilities including chat completions, embeddings, and streaming responses. This service is stateless and focuses solely on LLM interactions.

## Features

- **Multiple LLM Providers**: Support for OpenAI and Anthropic Claude
- **Stateless Architecture**: No database dependencies - pure LLM processing
- **Streaming Responses**: Real-time streaming of LLM responses to Node.js backend
- **Redis Caching**: Optional response caching for performance
- **Docker Support**: Both development and production Docker configurations
- **Health Monitoring**: Built-in health checks and monitoring

## Architecture

The service is built using:

- **FastAPI**: Modern, fast web framework for APIs
- **Stateless Design**: No database dependencies - pure request/response processing
- **Redis**: Optional caching for improved performance
- **Pydantic**: Data validation and serialization
- **Streaming**: Real-time response streaming to Node.js backend

## Service Responsibilities

This AI service is designed to be a lightweight, stateless microservice that:

1. **Receives LLM requests** from the Node.js backend
2. **Processes requests** with various LLM providers (OpenAI, Claude)
3. **Streams responses** back to the backend in real-time
4. **Handles no persistent state** - all data persistence is managed by the Node.js backend

### Environment Variables

```bash
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Development

### Running with Docker Compose

```bash
# Development mode
docker-compose -f docker-compose.dev.yml up ai-service

# Production mode
docker-compose up ai-service
```

### Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export REDIS_URL="redis://localhost:6379"
export OPENAI_API_KEY="your_key_here"

# Run the service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Documentation

- **Swagger UI**: <http://localhost:8000/api/v1/docs>
- **ReDoc**: <http://localhost:8000/api/v1/redoc>
- **Health Check**: <http://localhost:8000/api/v1/health>

## Docker Configuration

### Production (`Dockerfile`)

- Optimized for production use
- Non-root user for security
- Health checks included
- Minimal image size

### Development (`Dockerfile.dev`)

- Auto-reload on file changes
- Development dependencies included
- Volume mounting for live code updates

## Database Schema

**No database needed!** This service is completely stateless. All data persistence is handled by the Node.js backend service.

## Monitoring

The service includes:

- Health check endpoints
- Structured logging
- Error tracking
- Performance metrics

## Security

- Non-root Docker user
- Environment variable configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy ORM
