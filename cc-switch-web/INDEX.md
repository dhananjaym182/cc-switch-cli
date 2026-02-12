# CC-Switch Web - Documentation Index

Welcome to the CC-Switch Web documentation! This index helps you find what you need quickly.

## 🗺️ Navigation Guide

### 🚀 Getting Started (Start Here!)

1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - New to CC-Switch Web? Start here!
   - Prerequisites
   - Installation steps
   - First-time setup
   - Your first provider switch
   - Your first tool registration

2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick lookup for common tasks
   - Command cheat sheet
   - API endpoints
   - Tool schemas
   - Common issues

### 📖 Main Documentation

3. **[README.md](README.md)** - Complete reference manual
   - Full feature list
   - Installation guide
   - Configuration options
   - API endpoint reference
   - Security guidelines
   - Usage examples

### 🏗️ Technical Details

4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep dive into the system
   - System architecture diagrams
   - Backend design
   - Frontend design
   - Data flow
   - Design decisions
   - Tech stack details

### 💡 Practical Examples

5. **[EXAMPLES.md](EXAMPLES.md)** - Real-world usage scenarios
   - CC-Switch integration examples
   - Custom tool examples (JSON/YAML/ENV)
   - API usage with curl
   - Troubleshooting guide
   - Best practices
   - Advanced scenarios

### 📊 Project Overview

6. **[SUMMARY.md](SUMMARY.md)** - High-level project summary
   - What's been built
   - Architecture highlights
   - Features checklist
   - File structure
   - Design principles

## 📋 Quick Access by Topic

### Installation & Setup

- [Installation Steps](GETTING_STARTED.md#-installation)
- [Running the App](GETTING_STARTED.md#-running-the-application)
- [Quick Start Script](GETTING_STARTED.md#option-1-quick-start-script-recommended)
- [Configuration](README.md#-configuration)

### Features & Usage

- [CC-Switch Integration](README.md#cc-switch-integration-native-support)
- [Custom Tool Support](README.md#custom-cli-tool-support)
- [Dashboard Overview](GETTING_STARTED.md#1-explore-the-dashboard)
- [Switching Providers](GETTING_STARTED.md#2-switch-a-provider-if-cc-switch-is-configured)
- [Registering Tools](GETTING_STARTED.md#3-register-your-first-custom-tool)

### API Reference

- [All API Endpoints](QUICK_REFERENCE.md#-api-endpoints)
- [Status Endpoints](README.md#status)
- [CC-Switch Endpoints](README.md#cc-switch)
- [Custom Tool Endpoints](README.md#custom-tools)
- [Configuration Endpoints](README.md#configuration)

### Examples & Tutorials

- [JSON Tool Example](EXAMPLES.md#example-1-kilocode-json-config)
- [YAML Tool Example](EXAMPLES.md#example-2-droid-yaml-config)
- [ENV Tool Example](EXAMPLES.md#example-3-amp-cli-env-config)
- [API Usage Examples](EXAMPLES.md#api-usage-examples)
- [Advanced Scenarios](EXAMPLES.md#advanced-scenarios)

### Troubleshooting

- [Common Issues](GETTING_STARTED.md#-troubleshooting)
- [Detailed Troubleshooting](EXAMPLES.md#troubleshooting)
- [Quick Fixes](QUICK_REFERENCE.md#-troubleshooting)

### Architecture & Design

- [System Overview](ARCHITECTURE.md#overview)
- [Backend Architecture](ARCHITECTURE.md#backend-architecture)
- [Frontend Architecture](ARCHITECTURE.md#frontend-architecture)
- [Data Flow](ARCHITECTURE.md#data-flow)
- [Design Decisions](ARCHITECTURE.md#design-decisions)

## 📝 Document Summaries

### GETTING_STARTED.md (6.5 KB)
**Purpose**: First-time user guide  
**Audience**: Beginners  
**Content**: Installation, first steps, basic troubleshooting  
**Read time**: 10 minutes

### QUICK_REFERENCE.md (6 KB)
**Purpose**: Quick lookup reference  
**Audience**: All users  
**Content**: Commands, API endpoints, schemas, common tasks  
**Read time**: 5 minutes (or instant lookup)

### README.md (8.5 KB)
**Purpose**: Complete documentation  
**Audience**: All users  
**Content**: Everything you need to know  
**Read time**: 20 minutes

### ARCHITECTURE.md (17 KB)
**Purpose**: Technical deep dive  
**Audience**: Developers, contributors  
**Content**: System design, implementation details  
**Read time**: 30 minutes

### EXAMPLES.md (13 KB)
**Purpose**: Practical usage guide  
**Audience**: All users  
**Content**: Real-world examples, troubleshooting, best practices  
**Read time**: 25 minutes

### SUMMARY.md (14 KB)
**Purpose**: Project overview  
**Audience**: Developers, project managers  
**Content**: What's built, architecture, features  
**Read time**: 15 minutes

## 🎯 Reading Paths

### Path 1: "I want to get started NOW"
1. [GETTING_STARTED.md](GETTING_STARTED.md)
2. Start using the app
3. Refer to [QUICK_REFERENCE.md](QUICK_REFERENCE.md) as needed

### Path 2: "I need to understand the API"
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - API Endpoints section
2. [README.md](README.md) - API Endpoints section
3. [EXAMPLES.md](EXAMPLES.md) - API Usage Examples

### Path 3: "I want to register a custom tool"
1. [GETTING_STARTED.md](GETTING_STARTED.md#3-register-your-first-custom-tool)
2. [EXAMPLES.md](EXAMPLES.md#custom-tool-examples)
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-tool-schema-format)

### Path 4: "I'm having issues"
1. [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting)
2. [EXAMPLES.md](EXAMPLES.md#troubleshooting)
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-troubleshooting)

### Path 5: "I want to understand the architecture"
1. [SUMMARY.md](SUMMARY.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [README.md](README.md) - Design Philosophy section

### Path 6: "I want to contribute"
1. [ARCHITECTURE.md](ARCHITECTURE.md)
2. [README.md](README.md) - Development section
3. [SUMMARY.md](SUMMARY.md) - Implementation details

## 🔍 Search Guide

**Looking for...** | **Check this file** | **Section**
---|---|---
Installation steps | GETTING_STARTED.md | Installation
Quick commands | QUICK_REFERENCE.md | Common Commands
API endpoints | QUICK_REFERENCE.md or README.md | API Endpoints
Tool schemas | QUICK_REFERENCE.md | Tool Schema Format
Examples | EXAMPLES.md | Any section
Troubleshooting | EXAMPLES.md or GETTING_STARTED.md | Troubleshooting
Config locations | QUICK_REFERENCE.md | File Locations
Architecture details | ARCHITECTURE.md | Any section
Design decisions | ARCHITECTURE.md | Design Decisions
Feature list | README.md or SUMMARY.md | Features

## 📚 Additional Resources

### Code Files

- **Backend**: `backend/src/`
  - `index.js` - Main server
  - `routes.js` - API routes
  - `ccswitch-wrapper.js` - CLI wrapper
  - `tool-manager.js` - Tool config manager

- **Frontend**: `frontend/src/`
  - `App.jsx` - Main app
  - `pages/` - UI pages
  - `api.js` - API client

### Configuration Files

- **App Config**: `~/.cc-switch-web/config.json`
- **Backend Config**: `backend/.env`
- **Frontend Config**: `frontend/vite.config.js`

## 🎓 Learning Path

**Beginner** (1 hour):
1. Read GETTING_STARTED.md
2. Install and run the app
3. Try switching a provider
4. Register a test tool

**Intermediate** (2-3 hours):
1. Read README.md
2. Read EXAMPLES.md
3. Register your actual tools
4. Practice with different formats (JSON/YAML/ENV)
5. Try API endpoints with curl

**Advanced** (4-5 hours):
1. Read ARCHITECTURE.md
2. Explore the codebase
3. Understand data flow
4. Try advanced scenarios from EXAMPLES.md
5. Consider contributing

## 💡 Tips for Using This Documentation

1. **Bookmark this index** - Quick navigation to all docs
2. **Start with GETTING_STARTED** - Don't skip the basics
3. **Keep QUICK_REFERENCE handy** - For quick lookups
4. **Use Ctrl+F to search** - Find specific topics
5. **Read examples first** - See before doing
6. **Check troubleshooting** - Save debugging time

## 📧 Getting Help

Can't find what you need?

1. **Search this index** - Use Ctrl+F
2. **Check troubleshooting sections** - In multiple docs
3. **Review examples** - Real-world scenarios
4. **Read error messages** - Check terminal logs
5. **Verify configuration** - Check config files

## 🗂️ Document Status

| Document | Status | Last Updated | Size |
|----------|--------|--------------|------|
| INDEX.md | ✅ Current | Latest | 8 KB |
| GETTING_STARTED.md | ✅ Current | Latest | 6.5 KB |
| QUICK_REFERENCE.md | ✅ Current | Latest | 6 KB |
| README.md | ✅ Current | Latest | 8.5 KB |
| ARCHITECTURE.md | ✅ Current | Latest | 17 KB |
| EXAMPLES.md | ✅ Current | Latest | 13 KB |
| SUMMARY.md | ✅ Current | Latest | 14 KB |

**Total Documentation**: ~73 KB (39,000+ words)

## 🎯 Most Common Questions

**Q: How do I install?**  
→ [GETTING_STARTED.md](GETTING_STARTED.md#-installation)

**Q: How do I register a tool?**  
→ [GETTING_STARTED.md](GETTING_STARTED.md#3-register-your-first-custom-tool)

**Q: What API endpoints are available?**  
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-api-endpoints)

**Q: How do I create a tool schema?**  
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-example-tool-schemas)

**Q: Something's not working!**  
→ [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting)

**Q: How does the system work?**  
→ [ARCHITECTURE.md](ARCHITECTURE.md#overview)

**Q: Can I see some examples?**  
→ [EXAMPLES.md](EXAMPLES.md#custom-tool-examples)

**Q: What files were created?**  
→ [SUMMARY.md](SUMMARY.md#-file-structure)

## 🎉 You're Ready!

Pick your starting point from above and dive in!

**Recommended**: Start with [GETTING_STARTED.md](GETTING_STARTED.md)

---

**Quick Links**:
- 🚀 [Getting Started](GETTING_STARTED.md)
- 📖 [Full Documentation](README.md)
- ⚡ [Quick Reference](QUICK_REFERENCE.md)
- 💡 [Examples](EXAMPLES.md)
- 🏗️ [Architecture](ARCHITECTURE.md)
- 📊 [Summary](SUMMARY.md)

**Navigation**: This file | [Top](#cc-switch-web---documentation-index)
