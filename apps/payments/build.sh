#!/usr/bin/env bash
chmod +x ./build.sh
echo "Build new image..."
docker build -t ahmedelsharkawy/ticketing-paymentsservice .
echo "Pushing to docker hub..."
docker push ahmedelsharkawy/ticketing-paymentsservice
