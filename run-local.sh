#!/bin/bash

cd /app
npm install
npm run dev

tail -f /dev/null
