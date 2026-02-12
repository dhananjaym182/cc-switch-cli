import express from 'express';
import { loadConfig, saveConfig } from './config.js';
import { authMiddleware } from './auth.js';
import * as ccswitch from './ccswitch-wrapper.js';
import { ToolManager } from './tool-manager.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.get('/ccswitch/providers', async (req, res) => {
  try {
    const app = req.query.app || 'claude';
    const result = await ccswitch.listProviders(app);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json({ providers: result.providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ccswitch/current', async (req, res) => {
  try {
    const app = req.query.app || 'claude';
    const result = await ccswitch.getCurrentProvider(app);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json({ provider: result.provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ccswitch/switch', async (req, res) => {
  try {
    const { id, app = 'claude' } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Provider ID is required' });
    }
    
    const result = await ccswitch.switchProvider(id, app);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    const config = loadConfig();
    config.lastActiveProvider = id;
    saveConfig(config);
    
    res.json({ success: true, message: 'Provider switched successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ccswitch/config', async (req, res) => {
  try {
    const result = await ccswitch.getConfigShow();
    res.json({ output: result.output, error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tools', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    const tools = toolManager.getTools();
    
    res.json({ tools });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tools/:name', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    const tool = toolManager.getTool(req.params.name);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json({ tool });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tools/:name/status', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    const status = toolManager.getToolStatus(req.params.name);
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tools/register', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    
    const tool = toolManager.registerTool(req.body);
    saveConfig(config);
    
    res.json({ success: true, tool });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/tools/:name', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    
    const removed = toolManager.unregisterTool(req.params.name);
    
    if (!removed) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    saveConfig(config);
    
    res.json({ success: true, message: 'Tool unregistered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tools/:name/switch', (req, res) => {
  try {
    const config = loadConfig();
    const toolManager = new ToolManager(config);
    
    const { apiKey, endpoint, model } = req.body;
    
    const result = toolManager.switchToolConfig(req.params.name, apiKey, endpoint, model);
    saveConfig(config);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', (req, res) => {
  try {
    const config = loadConfig();
    
    const safeConfig = {
      lastActiveProvider: config.lastActiveProvider,
      lastActiveTool: config.lastActiveTool,
      toolCount: config.tools?.length || 0,
    };
    
    res.json(safeConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
