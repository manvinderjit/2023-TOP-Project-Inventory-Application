#!/bin/bash

# Start the app using the docker image
sudo docker run --platform linux/arm64 -d -v inventory-app-new:/public -p "$(aws ssm get-parameter --name "/inventory-app/env/PORT-TEST" --query "Parameter.Value" --output text)":"$(aws ssm get-parameter --name "/inventory-app/env/PORT-TEST" --query "Parameter.Value" --output text)" -e PORT="$(aws ssm get-parameter --name "/inventory-app/env/PORT-TEST" --query "Parameter.Value" --output text)" -e CONNECTION_STRING="$(aws ssm get-parameter --name "/inventory-app/env/connection-string" --query "Parameter.Value" --output text)" -e JWT_SECRET="$(aws ssm get-parameter --name "/inventory-app/env/JWT_SECRET" --query "Parameter.Value" --output text)" -e ACCESS_TOKEN_SECRET="$(aws ssm get-parameter --name "/inventory-app/env/ACCESS_TOKEN_SECRET" --query "Parameter.Value" --output text)" -e REFRESH_TOKEN_SECRET="$(aws ssm get-parameter --name "/inventory-app/env/REFRESH_TOKEN_SECRET" --query "Parameter.Value" --output text)" -e SESSION_TTL="$(aws ssm get-parameter --name "/inventory-app/env/SESSION-TTL" --query "Parameter.Value" --output text)" -e ALLOWED_ORIGINS="$(aws ssm get-parameter --name "/inventory-app/env/ALLOWED_ORIGINS" --query "Parameter.Value" --output text)" -e S3_BUCKET_NAME="$(aws ssm get-parameter --name "/inventory-app/env/S3_BUCKET_NAME" --query "Parameter.Value" --output text)" -e AWS_REGION="$(aws ssm get-parameter --name "/inventory-app/env/AWS_REGION" --query "Parameter.Value" --output text)" -e AWS_ACCESS_KEY_ID="$(aws ssm get-parameter --name "/inventory-app/env/AWS_ACCESS_KEY_ID" --query "Parameter.Value" --output text)" -e AWS_SECRET_ACCESS_KEY="$(aws ssm get-parameter --name "/inventory-app/env/AWS_SECRET_ACCESS_KEY" --query "Parameter.Value" --output text)" --name "$(aws ssm get-parameter --name "/inventory-app/images/name" --query "Parameter.Value" --output text)-v2" "$(aws ssm get-parameter --name "docker-image-name-inventory-app" --query "Parameter.Value" --output text)amd-arm-v2"

# Set restart option for the container
sudo docker update --restart on-failure inventory-app-v2