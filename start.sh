#!/bin/bash

# Script to start the development server with Node.js v22 compatibility

export NODE_OPTIONS=--openssl-legacy-provider

echo "Starting development server with legacy OpenSSL provider..."
npm start
