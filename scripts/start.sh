#!/bin/bash

# Clean up
rm -rf ./dist
mkdir ./dist

cp ./manifest.json ./dist/manifest.json

$(npm bin)/concurrently "yarn run build:dev" "yarn run start:firefox" "yarn run watch"
