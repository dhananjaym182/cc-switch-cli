# Universal AI CLI Configuration Orchestrator - System Architecture

## System Vision

Build an enterprise-grade Web UI platform that wraps and extends cc-switch-cli without modifying its source code, providing universal AI CLI configuration management for Claude, Codex, Gemini, and unlimited custom tools.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WEB BROWSER / CLIENT                          │
│                      (React + TypeScript + Tailwind)                    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTPS / WSS
                                    │ Port 3010
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          LAYER 2: API GATEWAY                           │
│                            (NestJS Backend)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                     REST API + WebSocket Server                     │ │
│  │  /api/status | /api/providers | /api/profiles | /api/apps, etc.    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                      │
│  ┌──────────────────┬─────────────┼──────────────┬──────────────────┐ │
│  │                  │             │              │                  │ │
│  ▼                  ▼             ▼              ▼                  ▼ │
│  ┌────────┐    ┌─────────┐  ┌─────────┐   ┌───────────┐    ┌──────────┐ │
│  │cc-switch│    │CLI-Engine│  │Profiles │   │  Security │    │   Logs   │ │
│  │Adapter │    │   Plugin │  │ Manager │   │  Module   │    │  Audit   │ │
│  └────────┘    └─────────┘  └─────────┘   └───────────┘    └──────────┘ │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│ LAYER 3:     │          │ LAYER 4:      │          │ LAYER 5:     │
│ cc-switch     │          │ Universal CLI │          │ Profile       │
│ CLI Commands  │          │ Extension     │          │ Management    │
│               │          │ Engine        │          │ System        │
│ • switch      │          │               │          │               │
│ • list        │          │ • Schema      │          │ • dev         │
│ • config      │          │   parser      │          │ • prod        │
│ • mcp         │          │ • Config      │          │ • rightstockai│
│ • prompts     │          │   modifier    │          │ • personal    │
└───────────────┘          │ • Validator   │          └───────────────┘
                           │ • Backup      │
                           └───────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│ CONFIG FILES  │          │ CONFIG FILES  │          │ PROFILES DB   │
│ ~/.cc-switch/ │          │ Various Paths │          │ (SQLite/PG)   │
│               │          │               │          │               │
│ • config.json │          │ • kilocode    │          │ • profiles    │
│ • providers/  │          │ • droid       │          │ • configs     │
│ • mcp/        │          │ • custom      │          │ • history     │
└───────────────┘          └───────────────┘          └───────────────┘
```

## Layer Details

### Layer 1: Web UI (Frontend)
**Technology Stack:** React 18, TypeScript, Tailwind CSS, Zustand (state), TanStack Query

**Pages:**
- **Dashboard**: Active provider, active profile, health status, quick actions
- **Providers**: Claude, Codex, Gemini (via cc-switch) management
- **Apps Registry**: List and manage CLI tools
- **Profiles**: Create, edit, switch profiles
- **Custom APIs**: Configure kilocode, droid, custom proxies
- **Logs & Audit**: View all configuration changes
- **Settings**: System configuration, security settings

**Real-time Features:**
- WebSocket connection for live updates
- Auto-refresh on provider switches
- Health monitoring with alerts

### Layer 2: Backend API Gateway
**Technology Stack:** NestJS 10, Node.js 18+, TypeScript

**Port:** 3010

**Core Modules:**
- **ccswitch-adapter**: Execute cc-switch CLI commands
- **cli-engine**: Universal CLI extension engine
- **profiles**: Profile management and state
- **security**: Secrets encryption, RBAC
- **logs**: Audit logging
- **plugins**: Plugin marketplace loader

### Layer 3: cc-switch Adapter Layer
**Purpose:** Wrap cc-switch-cli without modification

**Key Commands:**
```bash
cc-switch provider list              # List available providers
cc-switch provider switch <id>       # Switch active provider
cc-switch config show                # Show current config
cc-switch mcp list                   # List MCP servers
cc-switch prompts list               # List available prompts
cc-switch env                        # Get environment variables
```

**Adapter Pattern:**
```typescript
class CCSwitchAdapter {
  async listProviders(): Promise<Provider[]>;
  async switchProvider(id: string): Promise<void>;
  async getConfig(): Promise<Config>;
  async executeCommand(cmd: string): Promise<CommandResult>;
}
```

### Layer 4: Universal CLI Extension Engine
**Purpose:** Support unlimited custom CLI tools via schema-based plugins

**Schema Example:**
```typescript
interface CLIToolSchema {
  name: string;                    // e.g., "kilocode"
  type: 'custom' | 'proxy' | 'api';
  configPath: string;              // e.g., "~/.kilocode/config.json"
  format: 'json' | 'yaml' | 'toml' | 'env' | 'ini';
  fields: {
    apiKey: string;                // Field name for API key
    endpoint?: string;             // Field name for endpoint
    model?: string;                // Field name for model
  };
  validation: ValidationSchema;   // Config validation rules
  backup?: BackupStrategy;         // Backup before modify
}
```

**Supported Formats:**
- JSON, YAML, TOML, ENV, INI

**Capabilities:**
- Read/Parse config files
- Modify API keys, endpoints, models
- Validate config integrity
- Backup & rollback configs
- Dry-run mode for testing

### Layer 5: Profile Management System
**Purpose:** Manage multiple configuration profiles

**Supported Profiles:**
- `dev` - Development environment
- `prod` - Production environment
- `rightstockai` - RightStockAI workflows
- `personal` - Personal configurations
- Custom user-defined profiles

**Profile Structure:**
```typescript
interface Profile {
  id: string;
  name: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  providers: {
    [provider: string]: {
      apiKey?: string;
      endpoint?: string;
      model?: string;
      rateLimit?: RateLimitConfig;
      customFields?: Record<string, any>;
    };
  };
  customTools: {
    [toolName: string]: ConfigSnapshot;
  };
  activeProvider: string;
}
```

## Enterprise Features

### 1. Role-Based Access Control (RBAC)
- **Admin**: Full access, user management
- **Developer**: Switch providers, manage profiles
- **Viewer**: Read-only access

### 2. Audit Logging
- All configuration changes logged
- Who, what, when, why
- Rollback to any state

### 3. Secrets Encryption
- AES-256 encryption at rest
- Never expose plain API keys in UI
- Environment variable injection only

### 4. Config Versioning
- Git-like versioning for configs
- Diff view between versions
- One-click rollback

### 5. CLI Auto-Detection
- Scan for installed CLI tools
- Auto-register known tools
- Manual registration support

### 6. Health Monitoring
- Provider latency benchmarking
- API health checks
- Config validation alerts

### 7. Plugin Architecture
- Plugin marketplace (future)
- Custom schema definitions
- Plugin versioning and updates

### 8. Multi-User Support
- User authentication (JWT)
- User-specific profiles
- Team workspaces

## Security Model

### Data Flow
1. **UI Request** → Encrypted over HTTPS/WSS
2. **API Gateway** → Validate JWT permissions
3. **Adapter Layer** → Decrypt secrets
4. **CLI Execution** → Inject into environment
5. **Response** → Re-encrypt, return minimal data

### Threat Mitigations
- **Command Injection**: Whitelist-only commands, parameter validation
- **API Key Exposure**: Never log, never show in UI, encrypted storage
- **Unauthorized Access**: RBAC, JWT with refresh tokens
- **Config Corruption**: Backup before modify, validation, rollback

## Scalability Roadmap

### Phase 1 (Current)
- Single-node deployment
- SQLite database
- Local CLI execution

### Phase 2
- Multi-user support
- PostgreSQL database
- Distributed CLI execution agents

### Phase 3
- High availability
- Kubernetes deployment
- Plugin marketplace

### Phase 4
- Enterprise SSO
- Advanced RBAC
- Global config sync

## RightStockAI Integration

### Custom Presets
- Pre-configured profiles for RS workflows
- Optimized models and endpoints
- Rate limit configurations

### Workflow Automation
- Auto-switch providers on errors
- Cost optimization
- Performance monitoring

### Team Features
- Shared profiles
- Audit trail
- Compliance reports

## Technology Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 18 + TypeScript + Tailwind | UI Framework |
| State Management | Zustand + TanStack Query | State & Server State |
| Real-time | WebSocket Gateway | Live Updates |
| Backend | NestJS 10 + TypeScript | API Server |
| Database | SQLite (Phase 1) / PG (Phase 2) | Persistence |
| ORM | Prisma / TypeORM | Database Access |
| Validation | Zod / class-validator | Schema Validation |
| Security | bcryptjs, crypto | Encryption & Hashing |
| Testing | Jest, Playwright | Unit & E2E Tests |
| CLI Wrapping | execa, shell-quote | Safe Command Execution |

## Deployment Options

### Development
```bash
npm run dev          # Start backend
cd frontend && npm run dev  # Start frontend
```

### Production (Docker)
```bash
docker-compose up -d
```

### Production (Kubernetes)
```bash
kubectl apply -f k8s/
```

## Monitoring & Observability

- **Metrics**: Prometheus-compatible metrics
- **Logs**: Structured JSON logs with correlation IDs
- **Tracing**: Distributed tracing for CLI operations
- **Health**: `/health` endpoint for load balancers
- **Alerts**: Webhook-based alerting

## Documentation Standards

- **API Docs**: OpenAPI/Swagger at `/api/docs`
- **Architecture**: This document (ARCHITECTURE.md)
- **Contributing**: CONTRIBUTING.md
- **Changelog**: CHANGELOG.md

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Enterprise Production-Ready Design
