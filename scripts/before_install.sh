#!/bin/bash

# Login To Docker, Fetch Parameters from AWS Parameter Store
echo $(aws ssm get-parameter --name "docker-creds-token" --query "Parameter.Value" --output text) | docker login --username $(aws ssm get-parameter --name "docker-creds-username" --query "Parameter.Value" --output text) --password-stdin

# Get Docker Image from repo
docker pull "$(aws ssm get-parameter --name "docker-image-name-inventory-app" --query "Parameter.Value" --output text)amd-arm"
