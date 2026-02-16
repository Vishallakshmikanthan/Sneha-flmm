#!/bin/bash
set -e

echo "🚀 Starting Starry Night Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Version: $VERSION${NC}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

# Load environment-specific configuration
if [ "$ENVIRONMENT" == "production" ]; then
    CLUSTER="starrynight-production"
    SERVICE="starrynight-backend-service"
    TASK_DEFINITION="starrynight-backend-prod"
else
    CLUSTER="starrynight-staging"
    SERVICE="starrynight-backend-service-staging"
    TASK_DEFINITION="starrynight-backend-staging"
fi

# Step 1: Build Docker image
echo -e "\n${GREEN}Step 1: Building Docker image...${NC}"
docker build -t starrynight-backend:$VERSION ./backend

# Step 2: Tag and push to ECR
echo -e "\n${GREEN}Step 2: Pushing to AWS ECR...${NC}"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY

docker tag starrynight-backend:$VERSION $ECR_REGISTRY/starrynight-backend:$VERSION
docker tag starrynight-backend:$VERSION $ECR_REGISTRY/starrynight-backend:latest

docker push $ECR_REGISTRY/starrynight-backend:$VERSION
docker push $ECR_REGISTRY/starrynight-backend:latest

# Step 3: Run database migrations
echo -e "\n${GREEN}Step 3: Running database migrations...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${YELLOW}⚠️  Running migrations on PRODUCTION database${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi
fi

cd backend
npx prisma migrate deploy
cd ..

# Step 4: Update ECS task definition
echo -e "\n${GREEN}Step 4: Updating ECS task definition...${NC}"
aws ecs update-service \
    --cluster $CLUSTER \
    --service $SERVICE \
    --force-new-deployment \
    --region us-east-1

# Step 5: Wait for deployment to stabilize
echo -e "\n${GREEN}Step 5: Waiting for deployment to stabilize...${NC}"
aws ecs wait services-stable \
    --cluster $CLUSTER \
    --services $SERVICE \
    --region us-east-1

# Step 6: Health check
echo -e "\n${GREEN}Step 6: Running health checks...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    HEALTH_URL="https://api.starrynight.art/health"
else
    HEALTH_URL="https://api-staging.starrynight.art/health"
fi

for i in {1..5}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)
    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ Health check passed (attempt $i/5)${NC}"
        break
    else
        echo -e "${YELLOW}⚠ Health check failed (attempt $i/5): HTTP $HTTP_CODE${NC}"
        if [ $i -eq 5 ]; then
            echo -e "${RED}❌ Deployment failed health checks${NC}"
            exit 1
        fi
        sleep 10
    fi
done

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Version $VERSION is now live on $ENVIRONMENT${NC}"
