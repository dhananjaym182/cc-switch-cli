# CC-Switch Web - Quick Reference Card

## 🚀 Quick Start

```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend  
cd frontend && npm run dev

# Open browser
http://localhost:3000
```

## 🌐 URLs

| Service  | URL                        | Purpose          |
|----------|----------------------------|------------------|
| Frontend | http://localhost:3000      | Web UI           |
| Backend  | http://localhost:3010      | API Server       |
| Health   | http://localhost:3010/health | Health Check   |
| API      | http://localhost:3010/api  | REST API Base    |

## 📂 File Locations

| Type                  | Location                          |
|-----------------------|-----------------------------------|
| App Config            | `~/.cc-switch-web/config.json`    |
| Backend Source        | `cc-switch-web/backend/src/`      |
| Frontend Source       | `cc-switch-web/frontend/src/`     |
| Backend Config        | `cc-switch-web/backend/.env`      |
| CC-Switch Config      | `~/.cc-switch/config.json`        |
| Claude Config         | `~/.claude/settings.json`         |
| Codex Config          | `~/.codex/auth.json`              |
| Gemini Config         | `~/.gemini/.env`                  |

## 🔌 API Endpoints

### Status
```bash
GET /api/status
```

### CC-Switch Providers
```bash
# List providers
GET /api/ccswitch/providers?app=claude

# Get current provider
GET /api/ccswitch/current?app=claude

# Switch provider
POST /api/ccswitch/switch
Body: { "id": "1", "app": "claude" }
```

### Custom Tools
```bash
# List tools
GET /api/tools

# Get tool status
GET /api/tools/:name/status

# Register tool
POST /api/tools/register
Body: { "name": "...", "configPath": "...", ... }

# Update tool config
POST /api/tools/:name/switch
Body: { "apiKey": "...", "endpoint": "...", "model": "..." }

# Remove tool
DELETE /api/tools/:name
```

### Configuration
```bash
GET /api/config
```

## 🛠️ Tool Schema Format

```json
{
  "name": "tool-name",
  "configPath": "~/.tool/config.json",
  "apiKeyField": "apiKey",
  "endpointField": "baseUrl",
  "modelField": "model",
  "format": "json"
}
```

**Formats**: `json`, `yaml`, `env`

**Nested Fields**: Use dot notation
- `apiKey` → top-level field
- `api.key` → nested field
- `auth.credentials.token` → deeply nested

## 📝 Example Tool Schemas

### JSON Config
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

### YAML Config
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

### ENV Config
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

## 🔧 Common Commands

### Installation
```bash
# Quick start
./start.sh

# Manual
cd backend && npm install
cd frontend && npm install
```

### Development
```bash
# Backend dev
cd backend && npm start

# Frontend dev
cd frontend && npm run dev
```

### Testing
```bash
# Test backend
curl http://localhost:3010/api/status

# Test providers (with auth)
curl -u admin:password http://localhost:3010/api/ccswitch/providers?app=claude
```

### Configuration
```bash
# View app config
cat ~/.cc-switch-web/config.json

# Edit backend config
nano backend/.env

# Check backups
ls -la ~/.my-tool/*.backup-*
```

## 🔐 Authentication

### Enable Authentication
```bash
# In backend/.env
ADMIN_PASSWORD=your-password
```

### Disable Authentication
```bash
# In backend/.env
ADMIN_PASSWORD=
```

### Use with curl
```bash
curl -u "admin:password" http://localhost:3010/api/status
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change `PORT` in `.env` |
| cc-switch not found | Install or build cc-switch |
| Can't write config | Check file permissions |
| Tool config not found | Create config file first |
| Backend won't start | Check terminal for errors |
| Frontend won't load | Ensure backend is running |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `GETTING_STARTED.md` | First-time setup guide |
| `README.md` | Full documentation |
| `ARCHITECTURE.md` | Technical details |
| `EXAMPLES.md` | Usage examples |
| `SUMMARY.md` | Project overview |
| `QUICK_REFERENCE.md` | This file |

## 🔑 Key Features

- ✅ Switch Claude/Codex/Gemini providers
- ✅ Register custom CLI tools
- ✅ Update API configs with backup
- ✅ Multi-format support (JSON/YAML/ENV)
- ✅ Simple authentication
- ✅ File-based storage
- ✅ Local-only (localhost)

## 🎯 Workflow

### Switch CC-Switch Provider
1. Go to **CC-Switch** tab
2. Select app (Claude/Codex/Gemini)
3. Click **Switch** on provider
4. Done!

### Register Custom Tool
1. Go to **Custom Tools** tab
2. Click **Register New Tool**
3. Fill in schema
4. Click **Register**

### Update Tool Config
1. Find tool in list
2. Click **Switch Config**
3. Enter new values
4. Click **Update**
5. Backup created automatically

## 💡 Pro Tips

1. **Use Status button** - Check current config without editing
2. **Test with dummy tool** - Practice on test configs first
3. **Keep backups** - Automatic backups in `*.backup-*` files
4. **Check logs** - Keep terminal windows visible
5. **Read EXAMPLES.md** - See real-world use cases

## 🆘 Quick Help

```bash
# View current config
cat ~/.cc-switch-web/config.json

# Check backend logs
cd backend && npm start

# Check frontend logs
cd frontend && npm run dev

# Test API
curl http://localhost:3010/api/status
```

## 📧 Support

- Check troubleshooting in EXAMPLES.md
- Review architecture in ARCHITECTURE.md
- See setup guide in GETTING_STARTED.md
- Read full docs in README.md

---

**Quick Access**: Save this file for easy reference!

**Print**: `print QUICK_REFERENCE.md` or keep it open in your editor.

**Bookmark**: Add `http://localhost:3000` to your browser bookmarks.

🚀 **Happy API Switching!**
