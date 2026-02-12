# Getting Started with CC-Switch Web

Welcome! This guide will help you get CC-Switch Web up and running in just a few minutes.

## 🎯 What is CC-Switch Web?

CC-Switch Web is a lightweight local web UI for managing API configurations for:
- **Claude Code** (Anthropic)
- **Codex** (OpenAI)
- **Gemini** (Google)
- **Custom CLI tools** (kilocode, droid, amp-cli, etc.)

It wraps the existing `cc-switch` CLI and extends it to support any custom tool.

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```
   
   If not installed: [Download Node.js](https://nodejs.org/)

2. **cc-switch CLI** installed (optional but recommended)
   ```bash
   cc-switch --version
   ```
   
   If not installed, see: [cc-switch-cli](https://github.com/saladday/cc-switch-cli)
   
   > **Note**: The web UI can still manage custom tools without cc-switch installed

## 🚀 Installation

### Option 1: Quick Start Script (Recommended)

```bash
# From the cc-switch-web directory
./start.sh
```

This will:
- Check for Node.js
- Check for cc-switch CLI
- Install backend dependencies
- Install frontend dependencies

### Option 2: Manual Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## ▶️ Running the Application

You'll need **two terminal windows**:

### Terminal 1: Backend

```bash
cd backend
npm start
```

You should see:
```
🚀 CC-Switch Web Backend running on http://localhost:3010
📁 Config directory: ~/.cc-switch-web/
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Open Your Browser

Navigate to: **http://localhost:3000**

You should see the CC-Switch Web dashboard!

## 🎨 First Steps

### 1. Explore the Dashboard

The dashboard shows:
- Current active providers for Claude, Codex, and Gemini
- System status
- Registered custom tools

### 2. Switch a Provider (if cc-switch is configured)

1. Click **CC-Switch** in the navigation
2. Select an app (Claude/Codex/Gemini)
3. Click **Switch** on any provider
4. See the confirmation message!

### 3. Register Your First Custom Tool

1. Click **Custom Tools** in the navigation
2. Click **Register New Tool**
3. Fill in the form:

**Example for a JSON-based tool:**
```
Name: my-tool
Config Path: ~/.my-tool/config.json
API Key Field: apiKey
Endpoint Field: baseUrl
Model Field: model
Format: JSON
```

4. Click **Register**
5. Your tool is now registered!

### 4. Switch Tool Configuration

1. Find your registered tool in the list
2. Click **Switch Config**
3. Enter new values (API Key, Endpoint, Model)
4. Click **Update**
5. Your tool's config is updated (with automatic backup!)

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```bash
# Optional: Set password for authentication
ADMIN_PASSWORD=your-password-here

# Server port (default: 3010)
PORT=3010

# Environment
NODE_ENV=development
```

**Authentication**:
- **Enabled**: Set `ADMIN_PASSWORD` to any value
- **Disabled**: Leave `ADMIN_PASSWORD` empty (default)

### Application Configuration

The app stores its config in: `~/.cc-switch-web/config.json`

You can edit this file manually or use the UI.

## 📚 Documentation

### Quick Reference

- **README.md** - Full documentation, API reference, features
- **ARCHITECTURE.md** - Technical details, system design
- **EXAMPLES.md** - Practical examples, troubleshooting
- **SUMMARY.md** - Project overview
- **GETTING_STARTED.md** - This file

### Key Concepts

#### Tool Schema

A tool schema defines how to interact with a CLI tool's config:

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

#### Supported Formats

- **JSON**: `.json` files (most common)
- **YAML**: `.yaml`, `.yml` files
- **ENV**: `.env` files (KEY=value format)

#### Nested Fields

Use dot notation for nested properties:
- `apiKey` → `{ "apiKey": "..." }`
- `api.key` → `{ "api": { "key": "..." } }`
- `auth.credentials.token` → `{ "auth": { "credentials": { "token": "..." } } }`

## 🔍 Troubleshooting

### Backend won't start

**Problem**: Port already in use

**Solution**: Change port in `.env`:
```bash
PORT=3011
```

### Frontend can't connect to backend

**Problem**: Backend not running

**Solution**: Make sure backend is running in Terminal 1

### "cc-switch binary not found"

**Problem**: cc-switch not in PATH

**Solutions**:
1. Install cc-switch globally
2. Or build locally (backend will auto-detect)
3. Or just use custom tools (cc-switch not required)

### Tool config not updating

**Problem**: Config file doesn't exist

**Solution**: Create the config file first:
```bash
mkdir -p ~/.my-tool
echo '{}' > ~/.my-tool/config.json
```

### Permission denied

**Problem**: Can't write to config file

**Solution**: Fix permissions:
```bash
chmod 644 ~/.my-tool/config.json
```

## 💡 Tips

### 1. Test with a dummy tool first

Create a test config to practice:
```bash
mkdir -p ~/.test-tool
echo '{"apiKey":"test","baseUrl":"https://api.test.com"}' > ~/.test-tool/config.json
```

Then register it in the UI and practice switching configs.

### 2. Check backups

Backups are created automatically:
```bash
ls -la ~/.my-tool/
# config.json
# config.json.backup-1234567890
```

### 3. Use the Status button

Click **Status** on any tool to see its current configuration without editing.

### 4. Keep terminals visible

Keep both terminal windows visible so you can see logs and errors.

## 🎯 Next Steps

Now that you're up and running:

1. **Read EXAMPLES.md** - See practical use cases
2. **Register your tools** - Add your actual CLI tools
3. **Switch configs** - Practice updating configurations
4. **Explore the API** - Try the REST endpoints (see README.md)

## 🆘 Getting Help

If you run into issues:

1. Check **EXAMPLES.md** - Troubleshooting section
2. Check **ARCHITECTURE.md** - Technical details
3. Review terminal logs - Look for error messages
4. Check config files - Verify paths are correct

## 🎉 You're Ready!

You now have a fully functional web UI for managing API configurations!

**Happy switching!** 🚀

---

**Quick Links**:
- [Full Documentation](README.md)
- [Architecture Details](ARCHITECTURE.md)
- [Usage Examples](EXAMPLES.md)
- [Project Summary](SUMMARY.md)
