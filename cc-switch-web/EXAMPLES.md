# CC-Switch Web - Usage Examples

This document provides practical examples for using CC-Switch Web with various CLI tools.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [CC-Switch Integration](#cc-switch-integration)
3. [Custom Tool Examples](#custom-tool-examples)
4. [API Usage Examples](#api-usage-examples)
5. [Troubleshooting](#troubleshooting)

## Basic Setup

### Starting the Application

```bash
# Terminal 1: Start backend
cd cc-switch-web/backend
npm install
npm start

# Terminal 2: Start frontend
cd cc-switch-web/frontend
npm install
npm run dev

# Open browser
open http://localhost:3000
```

### Setting Up Authentication (Optional)

```bash
# In backend/.env
ADMIN_PASSWORD=your-secure-password

# Restart backend
npm start
```

## CC-Switch Integration

### Example 1: Switching Claude Providers

**Scenario**: You have multiple Claude API providers (official, proxy, local) and want to switch between them.

**Steps**:

1. Configure providers via cc-switch CLI:
   ```bash
   cc-switch --app claude provider add
   # Add: Claude Official, Claude Proxy, etc.
   ```

2. In the Web UI:
   - Go to **CC-Switch** tab
   - Select "Claude" from the dropdown
   - Click "Switch" on desired provider
   - Current provider is highlighted

**Result**: Claude config updated at `~/.claude/settings.json`

### Example 2: Managing Codex Providers

**Scenario**: Switch between OpenAI official API and a custom endpoint.

```bash
# Setup via CLI first
cc-switch --app codex provider add
# Name: OpenAI Official
# Endpoint: https://api.openai.com/v1
# API Key: sk-...

cc-switch --app codex provider add
# Name: Custom Proxy
# Endpoint: https://custom-proxy.com/v1
# API Key: custom-key-...
```

**Web UI**:
1. Go to **CC-Switch** → Select "Codex"
2. See all providers
3. Click "Switch" on desired provider

### Example 3: Gemini Configuration

**Scenario**: Switch between Gemini official and alternative endpoints.

```bash
cc-switch --app gemini provider add
```

**Web UI**: Same as above, select "Gemini" from dropdown

## Custom Tool Examples

### Example 1: Kilocode (JSON Config)

**Scenario**: You use Kilocode CLI with a JSON config file.

**Config File** (`~/.kilocode/config.json`):
```json
{
  "token": "old-api-key",
  "baseUrl": "https://api.kilocode.com",
  "model": "claude-3-opus"
}
```

**Registration in Web UI**:

1. Go to **Custom Tools** tab
2. Click "Register New Tool"
3. Fill in:
   - Name: `kilocode`
   - Config Path: `~/.kilocode/config.json`
   - API Key Field: `token`
   - Endpoint Field: `baseUrl`
   - Model Field: `model`
   - Format: `JSON`
4. Click "Register"

**Switching Configuration**:

1. Click "Switch Config" on Kilocode
2. Enter:
   - API Key: `new-api-key` (or leave empty)
   - Endpoint: `https://new-proxy.com` (or leave empty)
   - Model: `claude-3-sonnet` (or leave empty)
3. Click "Update"

**Result**:
- Original backed up to `~/.kilocode/config.json.backup-{timestamp}`
- New config written:
  ```json
  {
    "token": "new-api-key",
    "baseUrl": "https://new-proxy.com",
    "model": "claude-3-sonnet"
  }
  ```

### Example 2: Droid (YAML Config)

**Scenario**: Droid CLI uses YAML configuration.

**Config File** (`~/.droid/settings.yaml`):
```yaml
api:
  key: droid-key-123
  endpoint: https://api.droid.com
ai:
  model: gpt-4
  temperature: 0.7
```

**Registration**:

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

**Key Features**:
- Supports nested YAML paths (`api.key`)
- Preserves YAML formatting
- Backs up original file

### Example 3: AMP-CLI (ENV Config)

**Scenario**: AMP-CLI uses environment file.

**Config File** (`~/.amp/.env`):
```bash
AMP_API_KEY=amp-key-456
AMP_ENDPOINT=https://api.amp.dev
AMP_MODEL=gemini-pro
AMP_DEBUG=false
```

**Registration**:

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

**Switching**:

1. Switch Config → Enter new values
2. Result:
   ```bash
   AMP_API_KEY=new-key-789
   AMP_ENDPOINT=https://new-endpoint.com
   AMP_MODEL=gemini-ultra
   AMP_DEBUG=false
   ```

### Example 4: Custom CLI with Nested JSON

**Scenario**: Tool with deeply nested config.

**Config File** (`~/.my-tool/config.json`):
```json
{
  "version": "1.0",
  "auth": {
    "provider": "openai",
    "credentials": {
      "apiKey": "sk-...",
      "orgId": "org-..."
    }
  },
  "api": {
    "endpoint": {
      "base": "https://api.openai.com",
      "version": "v1"
    },
    "model": {
      "name": "gpt-4",
      "params": {
        "temperature": 0.7
      }
    }
  }
}
```

**Registration** (using nested paths):

```json
{
  "name": "my-tool",
  "configPath": "~/.my-tool/config.json",
  "apiKeyField": "auth.credentials.apiKey",
  "endpointField": "api.endpoint.base",
  "modelField": "api.model.name",
  "format": "json"
}
```

**Result**: Tool Manager handles nested paths automatically.

## API Usage Examples

### Example 1: List Providers Programmatically

```bash
# Get Claude providers
curl http://localhost:3010/api/ccswitch/providers?app=claude

# Response
{
  "providers": [
    {
      "id": "1",
      "name": "Official",
      "endpoint": "https://api.anthropic.com",
      "active": true
    },
    {
      "id": "2",
      "name": "Proxy",
      "endpoint": "https://proxy.com",
      "active": false
    }
  ]
}
```

### Example 2: Switch Provider via API

```bash
curl -X POST http://localhost:3010/api/ccswitch/switch \
  -H "Content-Type: application/json" \
  -d '{
    "id": "2",
    "app": "claude"
  }'

# Response
{
  "success": true,
  "message": "Provider switched successfully"
}
```

### Example 3: Register Tool via API

```bash
curl -X POST http://localhost:3010/api/tools/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "kilocode",
    "configPath": "~/.kilocode/config.json",
    "apiKeyField": "token",
    "endpointField": "baseUrl",
    "modelField": "model",
    "format": "json"
  }'

# Response
{
  "success": true,
  "tool": {
    "name": "kilocode",
    "configPath": "/home/user/.kilocode/config.json",
    "apiKeyField": "token",
    "endpointField": "baseUrl",
    "modelField": "model",
    "format": "json",
    "enabled": true
  }
}
```

### Example 4: Update Tool Config via API

```bash
curl -X POST http://localhost:3010/api/tools/kilocode/switch \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "new-key-123",
    "endpoint": "https://new-endpoint.com",
    "model": "claude-3-opus"
  }'

# Response
{
  "success": true,
  "tool": "kilocode"
}
```

### Example 5: Get Tool Status

```bash
curl http://localhost:3010/api/tools/kilocode/status

# Response
{
  "name": "kilocode",
  "configPath": "/home/user/.kilocode/config.json",
  "exists": true,
  "currentApiKey": "***",
  "currentEndpoint": "https://api.kilocode.com",
  "currentModel": "claude-3-opus"
}
```

### Example 6: With Authentication

```bash
# Set password in .env
ADMIN_PASSWORD=secret123

# Make authenticated request
curl -u "admin:secret123" \
  http://localhost:3010/api/ccswitch/providers?app=claude

# Or with header
curl -H "Authorization: Basic $(echo -n 'admin:secret123' | base64)" \
  http://localhost:3010/api/ccswitch/providers?app=claude
```

## Advanced Scenarios

### Scenario 1: Multiple Environment Switching

**Goal**: Switch between dev, staging, and production APIs.

**Setup**:

1. Register tool once with prod config path
2. Create multiple config presets:
   - `~/.my-tool/config.prod.json`
   - `~/.my-tool/config.staging.json`
   - `~/.my-tool/config.dev.json`

3. Before switching, copy desired preset:
   ```bash
   cp ~/.my-tool/config.dev.json ~/.my-tool/config.json
   ```

4. Or use tool registration for each:
   - Register `my-tool-dev` → `~/.my-tool/config.dev.json`
   - Register `my-tool-staging` → `~/.my-tool/config.staging.json`
   - Register `my-tool-prod` → `~/.my-tool/config.prod.json`

### Scenario 2: Bulk Provider Testing

**Goal**: Test API latency across all providers.

**Script**:

```bash
#!/bin/bash

# Get all providers
PROVIDERS=$(curl -s http://localhost:3010/api/ccswitch/providers?app=claude)

# Switch and test each
echo "$PROVIDERS" | jq -r '.providers[].id' | while read ID; do
  echo "Testing provider $ID..."
  curl -X POST http://localhost:3010/api/ccswitch/switch \
    -H "Content-Type: application/json" \
    -d "{\"id\":\"$ID\",\"app\":\"claude\"}"
  
  # Your test command here
  cc-switch provider speedtest "$ID"
  
  sleep 2
done
```

### Scenario 3: Automated Failover

**Goal**: Auto-switch if current provider fails.

**Script**:

```bash
#!/bin/bash

# Test current provider
if ! curl -f https://api.anthropic.com/health; then
  echo "Primary provider down, switching to backup..."
  
  curl -X POST http://localhost:3010/api/ccswitch/switch \
    -H "Content-Type: application/json" \
    -d '{"id":"backup-provider","app":"claude"}'
fi
```

## Troubleshooting

### Issue 1: "cc-switch binary not found"

**Problem**: Backend can't find cc-switch CLI.

**Solutions**:

1. Install cc-switch globally:
   ```bash
   sudo cp cc-switch /usr/local/bin/
   ```

2. Or build locally:
   ```bash
   cd src-tauri
   cargo build --release
   # Binary at: target/release/cc-switch
   ```

3. Backend will auto-detect local build at `../../src-tauri/target/release/cc-switch`

### Issue 2: Config file not found

**Problem**: Tool config path doesn't exist.

**Solution**:

1. Check path expansion:
   - `~/.tool/config.json` → `/home/user/.tool/config.json`
   - Use absolute paths if needed

2. Create config directory:
   ```bash
   mkdir -p ~/.my-tool
   echo '{}' > ~/.my-tool/config.json
   ```

### Issue 3: Permission denied writing config

**Problem**: Can't write to config file.

**Solution**:

```bash
# Check permissions
ls -la ~/.my-tool/config.json

# Fix permissions
chmod 644 ~/.my-tool/config.json
chmod 755 ~/.my-tool/
```

### Issue 4: Nested field not updating

**Problem**: Field like `api.key` not updating.

**Verification**:

```bash
# Check current config structure
cat ~/.my-tool/config.json | jq '.'

# Verify field exists
cat ~/.my-tool/config.json | jq '.api.key'
```

**Solution**: Make sure field path matches JSON structure exactly.

### Issue 5: YAML parsing error

**Problem**: YAML config not parsing.

**Solution**:

1. Validate YAML:
   ```bash
   npm install -g js-yaml
   js-yaml ~/.tool/config.yaml
   ```

2. Check for:
   - Tab characters (use spaces)
   - Incorrect indentation
   - Special characters

### Issue 6: Authentication not working

**Problem**: Getting 401 Unauthorized.

**Solutions**:

1. Check `.env` file exists:
   ```bash
   cat backend/.env
   ```

2. Restart backend after changing `.env`

3. Test with curl:
   ```bash
   curl -u "admin:your-password" \
     http://localhost:3010/api/status
   ```

## Best Practices

### 1. Always Backup First

Automatic backups are created, but you can manually backup:

```bash
cp ~/.my-tool/config.json ~/.my-tool/config.json.manual-backup
```

### 2. Test on Non-Critical Tools First

Before using on production tools:
1. Create a test tool
2. Practice switching configs
3. Verify backups work

### 3. Use Version Control for Tool Schemas

Save tool registrations:

```bash
# Export current config
curl http://localhost:3010/api/config > my-tools-config.json

# Later, restore by re-registering tools
```

### 4. Document Your Tool Configs

Keep a README for each tool:

```markdown
# My Tool Config

- **Config Path**: `~/.my-tool/config.json`
- **API Key Field**: `auth.apiKey`
- **Endpoint Field**: `api.baseUrl`
- **Format**: JSON
```

### 5. Monitor Config Changes

Use file watching to track changes:

```bash
# Install fswatch (macOS)
brew install fswatch

# Watch config
fswatch ~/.my-tool/config.json | while read file; do
  echo "Config changed: $file"
done
```

## Integration Examples

### Integrate with Shell Scripts

```bash
#!/bin/bash
# switch-to-dev.sh

curl -X POST http://localhost:3010/api/tools/my-tool/switch \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "$DEV_API_KEY",
    "endpoint": "https://dev.api.com"
  }'

echo "Switched to dev environment"
```

### Integrate with CI/CD

```yaml
# .github/workflows/test.yml
name: Test

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Switch to test API
        run: |
          curl -X POST http://localhost:3010/api/tools/my-tool/switch \
            -H "Content-Type: application/json" \
            -d '{
              "apiKey": "${{ secrets.TEST_API_KEY }}",
              "endpoint": "https://test.api.com"
            }'
      
      - name: Run tests
        run: npm test
```

### Integrate with Alfred/Raycast

Create a quick action to switch providers:

```bash
# alfred-switch-claude.sh
#!/bin/bash
osascript -e 'tell application "Google Chrome" to open location "http://localhost:3000/ccswitch"'
```

## Conclusion

CC-Switch Web provides a flexible interface for managing API configurations. These examples cover common use cases, but the extensible architecture allows for many more scenarios.

For more information, see:
- [README.md](README.md) - Installation and features
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
