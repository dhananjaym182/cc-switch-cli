# CC-Switch Web Architecture

## Overview

CC-Switch Web is a lightweight local web UI wrapper for cc-switch-cli. It follows a simple client-server architecture with a Node.js backend and React frontend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           React Frontend (Port 3000)                │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │Dashboard │  │CC-Switch │  │  Tools   │         │    │
│  │  │  Page    │  │  Panel   │  │  Panel   │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ HTTP/REST                        │
│                           ▼                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                           │                                  │
│  ┌────────────────────────▼───────────────────────────┐    │
│  │      Express Backend API (Port 3010)               │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │   CC-Switch  │  │ Tool Manager │               │    │
│  │  │   Wrapper    │  │              │               │    │
│  │  └──────┬───────┘  └──────┬───────┘               │    │
│  │         │                  │                        │    │
│  │         │                  │                        │    │
│  └─────────┼──────────────────┼────────────────────────┘    │
│            │                  │                              │
│  Localhost │                  │                              │
└────────────┼──────────────────┼──────────────────────────────┘
             │                  │
             │                  │
    ┌────────▼────────┐  ┌─────▼──────────────┐
    │  cc-switch CLI  │  │ Custom Tool Configs│
    │  (subprocess)   │  │ (~/.kilocode/, etc)│
    └─────────────────┘  └────────────────────┘
             │
             │
    ┌────────▼────────────────────┐
    │ CC-Switch Config Files      │
    │ ~/.cc-switch/               │
    │ ~/.claude/                  │
    │ ~/.codex/                   │
    │ ~/.gemini/                  │
    └─────────────────────────────┘
```

## Backend Architecture

### Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Dependencies**:
  - `cors`: CORS middleware
  - `dotenv`: Environment variables
  - `bcrypt`: Password hashing (optional)
  - `yaml`: YAML parsing

### Core Modules

#### 1. Configuration Manager (`config.js`)

**Purpose**: Manage application configuration and locate cc-switch binary

**Key Functions**:
- `ensureConfigDir()`: Create `~/.cc-switch-web/` if needed
- `loadConfig()`: Load config from `~/.cc-switch-web/config.json`
- `saveConfig()`: Save config atomically
- `getCCSwitchBinary()`: Locate cc-switch binary in PATH or local build

**Config Schema**:
```json
{
  "adminPassword": "",
  "tools": [
    {
      "name": "kilocode",
      "configPath": "/home/user/.kilocode/config.json",
      "apiKeyField": "token",
      "endpointField": "baseUrl",
      "modelField": "model",
      "format": "json",
      "enabled": true
    }
  ],
  "lastActiveProvider": "claude-official",
  "lastActiveTool": "kilocode"
}
```

#### 2. Authentication (`auth.js`)

**Purpose**: Simple password-based authentication for local use

**Key Functions**:
- `authMiddleware()`: Express middleware for HTTP Basic Auth
- `hashPassword()`: Hash password with bcrypt
- `verifyPassword()`: Verify password against hash

**Flow**:
1. Check if `ADMIN_PASSWORD` is set in environment
2. If not set, allow all requests (development mode)
3. If set, require HTTP Basic Auth
4. Compare provided password with environment variable

**Security Notes**:
- Uses HTTP Basic Auth (simple for localhost)
- No session management needed (stateless)
- Not designed for production/internet exposure

#### 3. CC-Switch Wrapper (`ccswitch-wrapper.js`)

**Purpose**: Execute cc-switch CLI commands and parse output

**Key Functions**:
- `executeCommand(args)`: Run cc-switch with subprocess
- `listProviders(app)`: Get provider list for app
- `getCurrentProvider(app)`: Get active provider
- `switchProvider(id, app)`: Switch to provider
- `getConfigShow()`: Get full config output

**Implementation Details**:

```javascript
// Execute command via child_process
const { stdout, stderr } = await execAsync(`cc-switch ${args}`);

// Parse table output
// Input:
// ┌────┬──────────────┬─────────────────────┐
// │ ID │ Name         │ Endpoint            │
// ├────┼──────────────┼─────────────────────┤
// │ 1  │ Official     │ https://api.com     │
// └────┴──────────────┴─────────────────────┘

// Output:
[
  { id: "1", name: "Official", endpoint: "https://api.com", active: false }
]
```

**Parsing Strategy**:
- Split output by newlines
- Detect table borders (`─`, `│`)
- Extract cells between `│` separators
- Skip header and border rows
- Build structured objects

#### 4. Tool Manager (`tool-manager.js`)

**Purpose**: Manage custom CLI tool configurations

**Key Features**:

##### Tool Registration
```javascript
registerTool({
  name: "kilocode",
  configPath: "~/.kilocode/config.json",
  apiKeyField: "token",
  endpointField: "baseUrl",
  modelField: "model",
  format: "json"
})
```

##### Config File Reading
- **JSON**: `JSON.parse()`
- **YAML**: `yaml.parse()`
- **ENV**: Custom parser for `KEY=value` format
- **TOML**: Not yet implemented (can be added)

##### Config File Writing
- Create backup: `config.json.backup-{timestamp}`
- Write new config atomically
- Preserve file format

##### Nested Property Access
- Support dot notation: `api.key`, `auth.token`
- Handle nested objects gracefully
- Create missing intermediate objects

**Example Flow**:
```javascript
// Read config
const config = readToolConfig(tool);
// { api: { key: "old-key" }, endpoint: "https://old.com" }

// Update nested property
setNestedProperty(config, "api.key", "new-key");
// { api: { key: "new-key" }, endpoint: "https://old.com" }

// Write back
writeToolConfig(tool, config);
// Original backed up to config.json.backup-1234567890
```

#### 5. Routes (`routes.js`)

**Purpose**: Define REST API endpoints

**Route Groups**:

##### Status
- `GET /api/status` - Health check

##### CC-Switch Integration
- `GET /api/ccswitch/providers?app=claude`
- `GET /api/ccswitch/current?app=claude`
- `POST /api/ccswitch/switch`
- `GET /api/ccswitch/config`

##### Custom Tools
- `GET /api/tools` - List all tools
- `GET /api/tools/:name` - Get tool details
- `GET /api/tools/:name/status` - Get tool status
- `POST /api/tools/register` - Register tool
- `POST /api/tools/:name/switch` - Update tool config
- `DELETE /api/tools/:name` - Unregister tool

##### Configuration
- `GET /api/config` - Get app config

**Middleware Stack**:
```
Request
  → CORS
  → JSON Body Parser
  → Auth Middleware
  → Route Handler
  → Response
```

## Frontend Architecture

### Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite 5
- **HTTP Client**: Fetch API

### Component Structure

```
App.jsx (Router & Layout)
├── Dashboard.jsx
│   ├── Provider Status Cards
│   └── System Info
├── CCSwitchPanel.jsx
│   ├── App Selector
│   ├── Provider List
│   └── Switch Actions
├── CustomToolsPanel.jsx
│   ├── Tool List
│   ├── Register Form
│   ├── Switch Modal
│   └── Status Modal
└── Settings.jsx
    ├── Config Info
    └── About
```

### State Management

**Strategy**: Component-level state with React hooks

- No Redux/MobX (overkill for simple app)
- `useState` for local state
- `useEffect` for data fetching
- Props for parent-child communication

**Example**:
```javascript
const [providers, setProviders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
    const data = await fetchProviders('claude');
    setProviders(data.providers);
    setLoading(false);
  }
  load();
}, []);
```

### API Client (`api.js`)

**Purpose**: Centralized API communication

**Pattern**: Promise-based fetch wrappers

```javascript
export async function fetchProviders(app = 'claude') {
  const response = await fetch(`/api/ccswitch/providers?app=${app}`);
  return response.json();
}
```

**Error Handling**:
- Let React components handle errors
- Display error messages in UI
- No global error handlers (simplicity)

### Styling Approach

**Tailwind CSS Utility-First**:

```jsx
<button className="inline-flex items-center px-4 py-2 
                   border border-transparent text-sm font-medium 
                   rounded-md shadow-sm text-white 
                   bg-indigo-600 hover:bg-indigo-700">
  Switch
</button>
```

**Benefits**:
- No CSS files to maintain
- Consistent design system
- Fast development
- Small production bundle

### Routing

**React Router DOM**:

```javascript
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/ccswitch" element={<CCSwitchPanel />} />
  <Route path="/tools" element={<CustomToolsPanel />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

**Navigation State**:
- Track active tab in App.jsx
- Update on route change
- Visual indicator in navbar

## Data Flow

### Provider Switching Flow

```
1. User clicks "Switch" on provider
   ↓
2. Frontend: switchProvider(id, app)
   ↓
3. POST /api/ccswitch/switch { id, app }
   ↓
4. Backend: executeCommand(`cc-switch --app ${app} provider switch ${id}`)
   ↓
5. cc-switch CLI updates ~/.claude/settings.json (or similar)
   ↓
6. Backend: saveConfig({ lastActiveProvider: id })
   ↓
7. Frontend: refresh provider list
   ↓
8. UI: show success message
```

### Custom Tool Configuration Flow

```
1. User registers tool schema
   ↓
2. Frontend: registerTool(schema)
   ↓
3. POST /api/tools/register
   ↓
4. Backend: validate schema, add to config.tools[]
   ↓
5. saveConfig()
   ↓
6. Frontend: refresh tool list

Later, user switches config:
1. User enters new API key/endpoint
   ↓
2. Frontend: switchToolConfig(name, apiKey, endpoint, model)
   ↓
3. POST /api/tools/:name/switch
   ↓
4. Backend: readToolConfig() → backup → update → writeToolConfig()
   ↓
5. ~/.kilocode/config.json updated (with backup created)
   ↓
6. Frontend: show success message
```

## File System Layout

```
~/.cc-switch-web/
└── config.json            # Application config

~/.cc-switch/
├── config.json            # CC-Switch main config
├── settings.json          # CC-Switch settings
└── backups/               # CC-Switch backups

~/.claude/
├── settings.json          # Claude config
└── CLAUDE.md             # Claude prompts

~/.codex/
├── auth.json             # Codex auth
├── config.toml           # Codex MCP
└── AGENTS.md             # Codex prompts

~/.gemini/
├── .env                  # Gemini config
├── settings.json         # Gemini MCP
└── GEMINI.md             # Gemini prompts

~/.kilocode/              # Example custom tool
└── config.json

~/.droid/                 # Example custom tool
└── settings.yaml
```

## Security Model

### Threat Model

**Assumptions**:
- Single-user local environment
- Trusted localhost access
- No internet exposure
- Physical machine security

**Not Protected Against**:
- Local privilege escalation (OS responsibility)
- Malicious local users (trusted environment)
- Network attacks (localhost only)

### Authentication Implementation

**When Enabled** (`ADMIN_PASSWORD` set):
```
Client
  → HTTP Basic Auth header
  → Base64(username:password)
Backend
  → Decode credentials
  → Compare password with env variable
  → Allow/Deny request
```

**When Disabled** (`ADMIN_PASSWORD` empty):
```
Client
  → No auth header
Backend
  → Skip auth check
  → Allow all requests
```

### File Permissions

- Config files: `0644` (readable by user)
- Backup files: `0644` (readable by user)
- Directory: `0755` (user can write)

## Error Handling

### Backend

**Strategy**: Return errors as JSON

```javascript
try {
  const result = await operation();
  res.json({ success: true, data: result });
} catch (error) {
  res.status(500).json({ 
    success: false, 
    error: error.message 
  });
}
```

### Frontend

**Strategy**: Display errors in UI

```javascript
try {
  await switchProvider(id);
  setMessage({ type: 'success', text: 'Switched!' });
} catch (error) {
  setMessage({ type: 'error', text: error.message });
}
```

## Performance Considerations

### Backend

- **Subprocess Overhead**: Each cc-switch command spawns a process (~50-100ms)
- **Config I/O**: File reads/writes are synchronous but fast (local SSD)
- **No Caching**: Every request hits disk (acceptable for local tool)

### Frontend

- **Bundle Size**: Vite tree-shaking keeps it small (~150KB gzipped)
- **API Calls**: No polling, only on user action
- **Rendering**: Simple lists, no virtualization needed

## Testing Strategy

### Backend

**Manual Testing**:
- Start backend: `npm start`
- Test endpoints: `curl http://localhost:3010/api/status`
- Verify file operations: Check `~/.cc-switch-web/`

**Potential Unit Tests**:
- Config read/write
- Tool schema validation
- Parser functions

### Frontend

**Manual Testing**:
- Start dev server: `npm run dev`
- Click through all features
- Check browser console for errors

**Potential E2E Tests**:
- Provider switching flow
- Tool registration flow
- Navigation between pages

## Deployment

### Local Development

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build
# Output: frontend/dist/

# Serve static files from Express
# (Future enhancement: serve frontend from backend)
```

### Alternative: Single Binary (Future)

Could package as Electron or Tauri app:
- Bundle Node.js backend
- Bundle React frontend
- Single executable
- Cross-platform

## Extensibility

### Adding New File Formats

**Example: TOML Support**

1. Add dependency: `npm install @iarna/toml`
2. Update `tool-manager.js`:

```javascript
import TOML from '@iarna/toml';

case 'toml':
  return TOML.parse(content);
```

### Adding New CLI Tools

**No Code Changes Needed**:

Users can register any tool via UI:
```json
{
  "name": "my-custom-cli",
  "configPath": "~/.my-cli/config.json",
  "apiKeyField": "auth.apiKey",
  "endpointField": "api.baseUrl",
  "format": "json"
}
```

### Adding New Features

**Example: Backup Restore for Custom Tools**

1. Add route: `POST /api/tools/:name/restore`
2. Implement in `tool-manager.js`:
```javascript
restoreBackup(name, backupPath) {
  const tool = this.getTool(name);
  const backup = fs.readFileSync(backupPath);
  fs.writeFileSync(tool.configPath, backup);
}
```
3. Add UI in `CustomToolsPanel.jsx`

## Design Decisions

### Why No Database?

- **Simplicity**: File-based config is trivial
- **Portability**: No setup, no migrations
- **Performance**: Local files are fast enough
- **Transparency**: Users can edit `config.json` manually

### Why Express Not NestJS?

- **Minimal**: Express is lighter for simple REST API
- **Familiarity**: More developers know Express
- **No Overhead**: No decorators, DI, or boilerplate

### Why Tailwind Not CSS Modules?

- **Speed**: Utility-first is faster to develop
- **Consistency**: Built-in design system
- **Bundle Size**: Purges unused styles

### Why React Not Vue/Svelte?

- **Ecosystem**: Largest component ecosystem
- **Tooling**: Best dev tools (React DevTools)
- **Familiarity**: Most developers know React

## Future Enhancements

### Potential Features

1. **Backup Management**: List and restore custom tool backups
2. **Config Validation**: Validate tool configs before writing
3. **Dry Run Mode**: Preview changes before applying
4. **Config Diff**: Show what changed in a config
5. **Batch Operations**: Switch multiple tools at once
6. **Import/Export**: Share tool schemas between machines
7. **CLI Integration**: `cc-switch-web` command to start server
8. **Desktop App**: Package as Electron/Tauri app

### Non-Goals

- ❌ Multi-user support
- ❌ Cloud hosting
- ❌ API proxying
- ❌ Request logging/analytics
- ❌ Complex authentication (OAuth, SSO)

## Conclusion

CC-Switch Web maintains a **simple, local-first architecture** that prioritizes ease of use over enterprise features. It's designed to be a practical tool for developers who want a GUI for cc-switch-cli without the complexity of a full-fledged web application.
