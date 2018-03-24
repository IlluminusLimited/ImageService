#!/bin/sh

echo "Called with stage: $1"

npm install

ruby serverless.rb deploy $1 false