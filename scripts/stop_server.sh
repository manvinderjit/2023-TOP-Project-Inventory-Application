#!/bin/bash

# Stop the current application deployment if running
docker stop inventory-app || true
docker rm inventory-app || true
