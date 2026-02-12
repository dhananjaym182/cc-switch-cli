# CC-Switch Web UI

> **Universal AI CLI Configuration Orchestrator**

An enterprise-grade Web UI platform that wraps and extends cc-switch-cli without modifying its source code. Provides universal AI CLI configuration management for Claude, Codex, Gemini, and unlimited custom tools.

## 🏗️ Architecture

This system is built using a layered enterprise architecture:

### Layer 1: Web UI (Frontend)
- **React 18** + TypeScript + Tailwind CSS
- Pages: Dashboard, Providers, Apps, Profiles, Logs, Settings
- Real-time updates via TanStack Query
- Zustand for state management

### Layer 2: Backend API Gateway
- **NestJS 10** backend running on port 3010
- REST APIs under `/api`
- WebSocket support for real-time updates
- Swagger/OpenAPI documentation at `/api/docs`

### Layer 3: cc-switch Adapter Layer
- Wraps cc-switch CLI commands
- Executes: `provider list`, `provider switch`, `config show`, `mcp list`, `prompts list`
- Handles errors and fallbacks

### Layer 4: Universal CLI Extension Engine ⭐
- Plugin-based system for unlimited CLI tools
- Schema-based config management
- Supported formats: JSON, YAML, TOML, ENV, INI
- Backup & rollback capabilities
- Config validation

### Layer 5: Profile Management System
- Multiple profiles: dev, prod, rightstockai, personal
- Switchable via UI and API
- Per-profile provider configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- cc-switch CLI installed and accessible

### Installation

```bash
# Clone and navigate to the project
cd cc-switch-web-ui

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Access the application at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3010
- **API Docs**: http://localhost:3010/api/docs

## 📁 Project Structure

```
cc-switch-web-ui/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── ccswitch-adapter/   # Layer 3: cc-switch wrapper
│   │   │   ├── cli-engine/         # Layer 4: Universal CLI engine
│   │   │   ├── profiles/           # Layer 5: Profile management
│   │   │   ├── security/            # Encryption & RBAC
│   │   │   ├── logs/                # Audit logging
│   │   │   └── plugins/             # Plugin system
│   │   ├── controllers/            # API controllers
│   │   └── services/                # Core services
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   ├── services/               # API client
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── schemas/                 # CLI tool schema definitions
│   └── cli-tool-schema.ts
│
├── docs/                    # Documentation
│   └── ARCHITECTURE.md
│
└── README.md
```

## 🎯 Key Features

### Universal CLI Extension Engine
Register any CLI tool with a schema:

```typescript
{
  "id": "kilocode",
  "name": "kilocode",
  "type": "custom",
  "configPath": "~/.kilocode/config.json",
  "format": "json",
  "fields": {
    "apiKey": "token",
    "endpoint": "baseUrl",
    "model": "model"
  },
  "validation": {
    "required": ["token"],
    "types": {
      "token": "string",
      "baseUrl": "url"
    }
  }
}
```

### Built-in Tool Support
- **Claude** (via cc-switch)
- **Gemini** (via cc-switch)
- **Codex** (via cc-switch)
- **Kilocode**
- **Droid**
- **Aider**
- **Continue**
- Custom proxies

### Profile Management
- Multiple named profiles
- Environment-specific configurations
- One-click profile switching
- Per-profile API keys and models

### Enterprise Features
- 🔐 Secrets encryption (AES-256)
- 📝 Audit logging
- 👥 Role-based access control (RBAC)
- 💾 Config versioning and rollback
- 🔄 CLI auto-detection
- 📊 Health monitoring
- 🔌 Plugin architecture

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Application
NODE_ENV=development
PORT=3010

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-32-char-encryption-key

# cc-switch CLI
CC_SWITCH_PATH=cc-switch
CC_SWITCH_CONFIG_HOME=~/.cc-switch

# Database (Phase 1: SQLite)
DATABASE_TYPE=sqlite
DATABASE_URL=file:./data/cc-switch.db
```

### Frontend Environment Variables

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3010/api
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | System status |
| GET | `/api/providers` | List providers |
| POST | `/api/providers/switch` | Switch provider |
| GET | `/api/apps` | List CLI tools |
| PUT | `/api/apps/:id/config` | Update tool config |
| GET | `/api/profiles` | List profiles |
| POST | `/api/profiles/active` | Set active profile |
| GET | `/api/logs` | Query audit logs |
| POST | `/api/security/encrypt` | Encrypt data |

Full API documentation available at http://localhost:3010/api/docs

## 🔒 Security

- **Encryption**: All secrets encrypted at rest using AES-256
- **API Keys**: Never logged, never displayed in plain text
- **RBAC**: Role-based access control (Admin, Developer, Viewer)
- **Audit Trail**: All configuration changes logged
- **Validation**: Command injection prevention via whitelisting

## 🌐 Platform Support

- ✅ Linux
- ✅ macOS
- ✅ Windows
- ✅ WSL

## 🚢 Deployment

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
```

## 🤝 Contributing

Contributions welcome! Please see `docs/CONTRIBUTING.md` for guidelines.

## 📄 License

MIT License - See main project LICENSE file

## 🔗 Links

- [cc-switch CLI](https://github.com/dhananjaym182/cc-switch-cli)
- [NestJS](https://nestjs.com/)
- [React](https://react.dev/)
- [API Documentation](http://localhost:3010/api/docs)

---

**Built with ❤️ for AI developers and DevOps teams**
