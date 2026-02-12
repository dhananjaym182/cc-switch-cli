# CC-Switch Web UI

A lightweight local web-based wrapper for cc-switch-cli that provides an intuitive interface for managing API configurations for Claude, Codex, Gemini, and custom CLI tools.

## 🎯 Purpose

CC-Switch Web UI is designed as a **local development tool** to simplify API switching for AI coding assistants. It wraps the existing cc-switch-cli functionality and extends support to additional custom CLI tools.

## ✨ Features

### Core Functionality

- **CC-Switch Integration**: Native support for Claude, Codex, and Gemini
  - List all configured providers
  - View current active provider
  - Switch providers with one click
  - Real-time status updates

- **Custom CLI Tool Support**: Extensible architecture for any CLI tool
  - Register tools with simple schema
  - Update API keys, endpoints, and models
  - Automatic config backup before changes
  - Support for JSON, YAML, and ENV formats

- **Simple & Local**:
  - No database required (file-based storage)
  - Simple password authentication (optional)
  - Runs on localhost only
  - No multi-user complexity

## 📁 Project Structure

```
cc-switch-web/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── index.js        # Main server
│   │   ├── config.js       # Configuration management
│   │   ├── auth.js         # Simple authentication
│   │   ├── routes.js       # API routes
│   │   ├── ccswitch-wrapper.js  # CC-Switch CLI wrapper
│   │   └── tool-manager.js      # Custom tool manager
│   ├── package.json
│   └── .env.example
│
└── frontend/               # React + Tailwind UI
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.jsx          # Overview
    │   │   ├── CCSwitchPanel.jsx      # Provider switching
    │   │   ├── CustomToolsPanel.jsx   # Custom tool management
    │   │   └── Settings.jsx           # Configuration
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **cc-switch-cli** installed and available in PATH
  - Or built locally at `../../src-tauri/target/release/cc-switch`

### Installation

1. **Install Backend Dependencies**

```bash
cd cc-switch-web/backend
npm install
```

2. **Configure Backend (Optional)**

```bash
cp .env.example .env
# Edit .env to set ADMIN_PASSWORD if needed
```

3. **Start Backend**

```bash
npm start
# Backend will run on http://localhost:3010
```

4. **Install Frontend Dependencies** (in a new terminal)

```bash
cd cc-switch-web/frontend
npm install
```

5. **Start Frontend**

```bash
npm run dev
# Frontend will run on http://localhost:3000
```

6. **Open Browser**

Navigate to `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend stores configuration in `~/.cc-switch-web/config.json`:

```json
{
  "adminPassword": "",
  "tools": [],
  "lastActiveProvider": "claude-official",
  "lastActiveTool": null
}
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Admin password for basic authentication
# Leave empty to disable authentication
ADMIN_PASSWORD=admin123

# Server port
PORT=3010

# Node environment
NODE_ENV=development
```

## 📖 Usage

### Managing CC-Switch Providers

1. Go to the **CC-Switch** tab
2. Select an application (Claude/Codex/Gemini)
3. View all configured providers
4. Click "Switch" to activate a provider
5. See real-time status updates

### Managing Custom Tools

#### Registering a Tool

1. Go to the **Custom Tools** tab
2. Click "Register New Tool"
3. Fill in the tool schema:
   - **Name**: Tool identifier (e.g., "kilocode")
   - **Config Path**: Path to config file (e.g., `~/.kilocode/config.json`)
   - **API Key Field**: JSON path to API key (e.g., `apiKey` or `auth.token`)
   - **Endpoint Field**: JSON path to endpoint (e.g., `baseUrl`)
   - **Model Field**: JSON path to model (e.g., `model`)
   - **Format**: File format (JSON/YAML/ENV)

#### Example Tool Schemas

**Kilocode (JSON)**
```json
{
  "name": "kilocode",
  "configPath": "~/.kilocode/config.json",
  "apiKeyField": "token",
  "endpointField": "baseUrl",
  "modelField": "model",
  "format": "json"
}
```

**Droid (YAML)**
```json
{
  "name": "droid",
  "configPath": "~/.droid/settings.yaml",
  "apiKeyField": "api.key",
  "endpointField": "api.endpoint",
  "modelField": "ai.model",
  "format": "yaml"
}
```

**AMP-CLI (ENV)**
```json
{
  "name": "amp-cli",
  "configPath": "~/.amp/.env",
  "apiKeyField": "AMP_API_KEY",
  "endpointField": "AMP_ENDPOINT",
  "modelField": "AMP_MODEL",
  "format": "env"
}
```

#### Switching Tool Configuration

1. Click "Switch Config" on a registered tool
2. Enter new values:
   - API Key (optional)
   - Endpoint (optional)
   - Model (optional)
3. Click "Update"
4. Original config is automatically backed up

### Dashboard

The dashboard shows:
- Current active providers for Claude, Codex, and Gemini
- Last active provider
- Last active custom tool
- Total registered tools
- System configuration paths

## 🔌 API Endpoints

### Status

- `GET /api/status` - API health check

### CC-Switch

- `GET /api/ccswitch/providers?app=claude` - List providers
- `GET /api/ccswitch/current?app=claude` - Get current provider
- `POST /api/ccswitch/switch` - Switch provider
  ```json
  {
    "id": "provider-id",
    "app": "claude"
  }
  ```
- `GET /api/ccswitch/config` - Show cc-switch config

### Custom Tools

- `GET /api/tools` - List all registered tools
- `GET /api/tools/:name` - Get tool details
- `GET /api/tools/:name/status` - Get tool config status
- `POST /api/tools/register` - Register new tool
  ```json
  {
    "name": "kilocode",
    "configPath": "~/.kilocode/config.json",
    "apiKeyField": "token",
    "endpointField": "baseUrl",
    "modelField": "model",
    "format": "json"
  }
  ```
- `POST /api/tools/:name/switch` - Update tool config
  ```json
  {
    "apiKey": "new-key",
    "endpoint": "https://api.example.com",
    "model": "gpt-4"
  }
  ```
- `DELETE /api/tools/:name` - Unregister tool

### Configuration

- `GET /api/config` - Get application config

## 🔒 Security

### Simple Local Authentication

CC-Switch Web uses basic password authentication for local development:

1. Set `ADMIN_PASSWORD` in `.env`
2. Leave empty to disable authentication
3. The UI will prompt for credentials if enabled
4. Uses HTTP Basic Auth (username can be anything)

**Important**: This is designed for **local use only**. Do not expose to the internet.

### Why Simple?

- This is a **local developer tool**, not a multi-user SaaS
- No need for OAuth, RBAC, or complex auth systems
- File-based storage is sufficient for single-user scenarios
- Keeps the implementation minimal and maintainable

## 🛡️ Design Philosophy

### Keep It Simple

- **Local-first**: Designed for localhost, not production
- **File-based**: No database overhead
- **Minimal deps**: Only essential libraries
- **Single-user**: No multi-user complexity
- **Focused**: API switching only, not a full orchestrator

### What This Is NOT

- ❌ Not a multi-user SaaS platform
- ❌ Not an API proxy or request router
- ❌ Not a complex orchestration system
- ❌ Not designed for production deployment

### What This IS

- ✅ A local developer tool
- ✅ A simple UI for cc-switch-cli
- ✅ An extensible tool for custom CLIs
- ✅ A practical config switcher

## 🧪 Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Building for Production

```bash
# Backend: No build needed (Node.js)

# Frontend
cd frontend
npm run build
# Static files will be in frontend/dist/
```

## 📝 Configuration File Formats

### JSON Support

```json
{
  "apiKey": "sk-...",
  "baseUrl": "https://api.example.com",
  "model": "gpt-4"
}
```

### YAML Support

```yaml
api:
  key: sk-...
  endpoint: https://api.example.com
ai:
  model: gpt-4
```

### ENV Support

```bash
API_KEY=sk-...
BASE_URL=https://api.example.com
MODEL=gpt-4
```

## 🤝 Contributing

This is a lightweight wrapper around cc-switch-cli. Contributions should maintain the simple, local-first philosophy.

### Guidelines

- Keep dependencies minimal
- Maintain file-based storage
- No database complexity
- Focus on API switching only
- Test locally before submitting PRs

## 📄 License

MIT License - See main project LICENSE file

## 🙏 Credits

Built as a lightweight web wrapper for [cc-switch-cli](https://github.com/saladday/cc-switch-cli)
