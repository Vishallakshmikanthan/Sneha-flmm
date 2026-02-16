#!/bin/bash
set -e

echo "🔄 Emergency Rollback Initiated..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-production}
PREVIOUS_VERSION=${2}

if [ -z "$PREVIOUS_VERSION" ]; then
    echo -e "${RED}Error: Previous version required${NC}"
    echo "Usage: ./rollback.sh <environment> <previous_version>"
    exit 1
fi

echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Rolling back to version: $PREVIOUS_VERSION${NC}"

# Confirmation
read -p "Are you sure you want to rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Rollback cancelled${NC}"
    exit 1
fi

# Set cluster and service based on environment
if [ "$ENVIRONMENT" == "production" ]; then
    CLUSTER="starrynight-production"
    SERVICE="starrynight-backend-service"
else
    CLUSTER="starrynight-staging"
    SERVICE="starrynight-backend-service-staging"
fi

# Step 1: Get previous task definition
echo -e "\n${GREEN}Step 1: Retrieving previous task definition...${NC}"
TASK_DEF_ARN=$(aws ecs describe-task-definition \
    --task-definition starrynight-backend:$PREVIOUS_VERSION \
    --region us-east-1 \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

if [ -z "$TASK_DEF_ARN" ]; then
    echo -e "${RED}Error: Could not find task definition for version $PREVIOUS_VERSION${NC}"
    exit 1
fi

# Step 2: Update service to previous version
echo -e "\n${GREEN}Step 2: Updating ECS service to previous version...${NC}"
aws ecs update-service \
    --cluster $CLUSTER \
    --service $SERVICE \
    --task-definition $TASK_DEF_ARN \
    --force-new-deployment \
    --region us-east-1

# Step 3: Wait for rollback to complete
echo -e "\n${GREEN}Step 3: Waiting for rollback to complete...${NC}"
aws ecs wait services-stable \
    --cluster $CLUSTER \
    --services $SERVICE \
    --region us-east-1

# Step 4: Verify health
echo -e "\n${GREEN}Step 4: Verifying application health...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    HEALTH_URL="https://api.starrynight.art/health"
else
    HEALTH_URL="https://api-staging.starrynight.art/health"
fi

sleep 10
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Rollback successful! Application is healthy.${NC}"
else
    echo -e "${RED}⚠️  Rollback completed but health check failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Step 5: Notify team
echo -e "\n${YELLOW}⚠️  Remember to:${NC}"
echo "1. Investigate the root cause of the failure"
echo "2. Rollback database migrations if necessary"
echo "3. Notify the team via Slack"
echo "4. Update incident log"

echo -e "\n${GREEN}Rollback to version $PREVIOUS_VERSION completed${NC}"
