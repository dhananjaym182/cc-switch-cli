# Deployment Guide

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- cc-switch CLI accessible on the host or in container
- Domain name (optional)
- SSL certificate (optional, recommended for production)

### Environment Variables

Create a `.env` file in the project root:

```bash
# Security (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Application
NODE_ENV=production
PORT=3010
FRONTEND_URL=https://your-domain.com

# Database (Phase 2: PostgreSQL)
DATABASE_TYPE=sqlite
# DATABASE_TYPE=postgresql
# DATABASE_URL=postgresql://user:password@localhost:5432/ccswitch

# cc-switch CLI
CC_SWITCH_PATH=cc-switch
CC_SWITCH_CONFIG_HOME=/root/.cc-switch

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Backups
AUTO_BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
```

### Docker Deployment

#### 1. Build and Start

```bash
docker-compose up -d
```

#### 2. Verify Deployment

```bash
# Check backend health
curl http://localhost:3010/api/status/health

# Check frontend
curl http://localhost/
```

#### 3. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

#### 4. Stop Services

```bash
docker-compose down
```

### Kubernetes Deployment

#### 1. Create ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cc-switch-config
data:
  NODE_ENV: "production"
  PORT: "3010"
  DATABASE_TYPE: "sqlite"
```

#### 2. Create Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cc-switch-secrets
type: Opaque
data:
  JWT_SECRET: <base64-encoded>
  ENCRYPTION_KEY: <base64-encoded>
```

#### 3. Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

#### 4. Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Manual Deployment

#### Backend

```bash
cd backend
npm install
npm run build
NODE_ENV=production npm run start:prod
```

#### Frontend

```bash
cd frontend
npm install
npm run build
# Serve dist/ with nginx or any static file server
```

### SSL/HTTPS Configuration

#### Using nginx as Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### Monitoring

#### Health Checks

- Backend: `GET /api/status/health`
- Response:
  ```json
  {
    "status": "ok",
    "checks": {
      "database": "ok",
      "api": "ok",
      "ccswitch": "ok"
    }
  }
  ```

#### Metrics (Optional)

Prometheus metrics endpoint can be enabled in future versions at `/metrics`.

### Backup Strategy

#### Database Backups

```bash
# SQLite backup
docker exec cc-switch-backend cp data/cc-switch.db /backup/cc-switch-$(date +%Y%m%d).db
```

#### Configuration Backups

Configuration backups are automatically created in `~/.cc-switch/backups/`.

### Scaling

#### Horizontal Scaling

For high availability, deploy multiple backend instances behind a load balancer:

```yaml
# docker-compose.override.yml
services:
  backend:
    deploy:
      replicas: 3
```

### Troubleshooting

#### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Check cc-switch installation
docker exec cc-switch-backend cc-switch --version

# Verify environment variables
docker exec cc-switch-backend env | grep -E "(JWT_SECRET|ENCRYPTION_KEY)"
```

#### Frontend shows 502

```bash
# Check backend connectivity
docker exec cc-switch-frontend wget -O- http://backend:3010/api/status/health
```

#### Database locked

```bash
# Restart backend service
docker-compose restart backend
```

### Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Change default ENCRYPTION_KEY
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up log rotation
- [ ] Configure backup schedule
- [ ] Review access controls
- [ ] Enable audit logging
- [ ] Set up monitoring alerts

### Performance Tuning

#### Backend

- Enable response caching
- Increase worker threads
- Optimize database queries
- Enable compression

#### Frontend

- Enable CDN for static assets
- Implement service worker for caching
- Optimize bundle size
- Enable lazy loading

### Maintenance

#### Updates

```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build

# Restart services
docker-compose up -d
```

#### Log Rotation

Configure log rotation in `/etc/logrotate.d/cc-switch`:

```
/var/lib/docker/containers/*/*.log {
  daily
  rotate 7
  compress
  delaycompress
  missingok
  notifempty
}
```

### Support

For issues and questions:
- Check logs: `docker-compose logs`
- Review documentation: `docs/`
- Open an issue on GitHub
