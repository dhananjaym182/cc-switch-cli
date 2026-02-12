import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import { ensureConfigDir } from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

ensureConfigDir();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`\n🚀 CC-Switch Web Backend running on http://localhost:${PORT}`);
  console.log(`📁 Config directory: ~/.cc-switch-web/`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  GET  /api/status`);
  console.log(`  GET  /api/ccswitch/providers?app=claude`);
  console.log(`  GET  /api/ccswitch/current?app=claude`);
  console.log(`  POST /api/ccswitch/switch`);
  console.log(`  GET  /api/ccswitch/config`);
  console.log(`  GET  /api/tools`);
  console.log(`  POST /api/tools/register`);
  console.log(`  POST /api/tools/:name/switch`);
  console.log(`  GET  /api/config\n`);
});
