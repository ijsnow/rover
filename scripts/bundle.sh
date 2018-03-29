#!/bin/bash

# Clean up
rm -rf ./dist
mkdir ./dist

yarn run build:prod

cp ./manifest.json ./dist/manifest.json

$(yarn bin)/web-ext build -s ./dist -a ./bundles -o true