#!/bin/sh

echo "Called with stage: $1"

npm install --production

ruby serverless.rb deploy $1 false