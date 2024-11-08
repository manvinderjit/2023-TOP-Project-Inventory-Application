#!/bin/bash

# Stop the current application deployment if running
docker stop inventory-app-v2 || true
docker rm inventory-app-v2 || true
