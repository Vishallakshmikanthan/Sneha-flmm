# Production Deployment & DevOps - Quick Reference

## 🚀 Quick Start Commands

### Local Development
```bash
# Start all services with Docker Compose
cd backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Deploy to Staging
```bash
# Automated deployment
git checkout staging
git merge feature/your-branch
git push origin staging
# GitHub Actions will automatically deploy
```

### Deploy to Production
```bash
# Requires manual approval in GitHub Actions
git checkout main
git merge staging
git push origin main
# Approve deployment in GitHub Actions UI
```

### Emergency Rollback
```bash
# Rollback to previous version
./scripts/rollback.sh production <previous-version>
```

---

## 📁 Created Files

### CI/CD Workflows
- [.github/workflows/ci.yml](file:///c:/Users/visha/Downloads/Starry-Night/.github/workflows/ci.yml) - Automated testing and linting
- [.github/workflows/deploy-production.yml](file:///c:/Users/visha/Downloads/Starry-Night/.github/workflows/deploy-production.yml) - Production deployment pipeline

### Configuration
- [vercel.json](file:///c:/Users/visha/Downloads/Starry-Night/vercel.json) - Vercel deployment settings
- [next.config.js](file:///c:/Users/visha/Downloads/Starry-Night/next.config.js) - Enhanced Next.js configuration
- [.env.example](file:///c:/Users/visha/Downloads/Starry-Night/.env.example) - Environment variables template

### Docker
- [backend/Dockerfile](file:///c:/Users/visha/Downloads/Starry-Night/backend/Dockerfile) - Multi-stage production build
- [backend/docker-compose.yml](file:///c:/Users/visha/Downloads/Starry-Night/backend/docker-compose.yml) - Local development environment

### Scripts
- [scripts/deploy.sh](file:///c:/Users/visha/Downloads/Starry-Night/scripts/deploy.sh) - Automated deployment script
- [scripts/rollback.sh](file:///c:/Users/visha/Downloads/Starry-Night/scripts/rollback.sh) - Emergency rollback script

### Infrastructure (Terraform)
- [infrastructure/terraform/main.tf](file:///c:/Users/visha/Downloads/Starry-Night/infrastructure/terraform/main.tf) - VPC and networking
- [infrastructure/terraform/rds.tf](file:///c:/Users/visha/Downloads/Starry-Night/infrastructure/terraform/rds.tf) - PostgreSQL database
- [infrastructure/terraform/ecs.tf](file:///c:/Users/visha/Downloads/Starry-Night/infrastructure/terraform/ecs.tf) - ECS Fargate cluster

---

## 🏗️ Infrastructure Overview

### Architecture
```
┌─────────────┐
│  Cloudflare │ → DDoS Protection, CDN
└──────┬──────┘
       │
┌──────▼──────┐
│   Vercel    │ → Next.js Frontend (Global Edge)
└──────┬──────┘
       │
┌──────▼──────┐
│     ALB     │ → Load Balancer
└──────┬──────┘
       │
┌──────▼──────┐
│  ECS Fargate│ → Backend (Auto-scaling 2-10 tasks)
└──┬────┬─────┘
   │    │
   │    └─────────┐
   │              │
┌──▼────┐  ┌─────▼────┐
│  RDS  │  │  Redis   │
│ (PG)  │  │ (Cache)  │
└───────┘  └──────────┘
```

### Environments
- **Development**: Local Docker Compose
- **Staging**: AWS (1 ECS task, db.t3.medium)
- **Production**: AWS (2-10 ECS tasks, db.m5.large, Multi-AZ)

---

## 🔐 Security Checklist

- [x] HTTPS enforced with HSTS headers
- [x] JWT authentication with HttpOnly cookies
- [x] Rate limiting (100 req/min per IP)
- [x] WAF rules for SQL injection and XSS
- [x] Database encryption at rest and in transit
- [x] Secrets stored in AWS Secrets Manager
- [x] Container security scanning (ECR)
- [x] Dependency vulnerability scanning (Snyk)
- [x] Non-root Docker user
- [x] CORS properly configured

---

## 📊 Monitoring

### Sentry (Error Tracking)
- Frontend: `NEXT_PUBLIC_SENTRY_DSN`
- Backend: Integrated in NestJS
- Alerts: Error rate > 1% → Slack notification

### CloudWatch (Infrastructure)
- ECS task metrics (CPU, memory)
- RDS performance (connections, queries)
- ALB metrics (requests, latency)
- Custom application metrics

### Performance Targets
- API Response: < 200ms (p95)
- Frontend Load: < 3s globally
- Database Query: < 50ms (indexed)
- Uptime: 99.9%+

---

## 🔄 Deployment Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   # Create PR → CI runs automatically
   ```

2. **Staging Deployment**
   ```bash
   # After PR approval
   git checkout staging
   git merge feature/new-feature
   git push origin staging
   # Auto-deploys to staging
   ```

3. **Production Deployment**
   ```bash
   # After staging verification
   git checkout main
   git merge staging
   git push origin main
   # Requires manual approval in GitHub Actions
   ```

---

## 💰 Cost Estimates

### Staging (~$50-100/month)
- ECS Fargate: ~$15
- RDS db.t3.medium: ~$35
- Redis cache.t3.micro: ~$12
- S3 + CloudFront: ~$5
- Vercel: Free tier

### Production (~$300-500/month)
- ECS Fargate (2-10 tasks): ~$100-200
- RDS db.m5.large + replica: ~$150
- Redis cache.m5.large: ~$80
- S3 + CloudFront: ~$20
- Vercel Pro: ~$20
- Monitoring (Sentry, CloudWatch): ~$30

---

## 🆘 Troubleshooting

### Deployment Failed
```bash
# Check GitHub Actions logs
# View ECS service events
aws ecs describe-services --cluster starrynight-production --services starrynight-backend-service

# Check CloudWatch logs
aws logs tail /ecs/starrynight-production --follow
```

### Database Issues
```bash
# Check RDS metrics
aws rds describe-db-instances --db-instance-identifier starrynight-db-production

# View slow queries
# Access RDS Performance Insights in AWS Console
```

### Rollback
```bash
# Emergency rollback
./scripts/rollback.sh production v1.2.3

# Verify health
curl https://api.starrynight.art/health
```

---

## 📚 Next Steps

1. **Set up AWS Account**
   - Create AWS account
   - Configure IAM users and roles
   - Set up billing alerts

2. **Configure Secrets**
   - Add secrets to AWS Secrets Manager
   - Configure Vercel environment variables
   - Set up GitHub Actions secrets

3. **Initialize Infrastructure**
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform plan
   terraform apply
   ```

4. **First Deployment**
   - Push code to `staging` branch
   - Verify staging deployment
   - Merge to `main` for production
