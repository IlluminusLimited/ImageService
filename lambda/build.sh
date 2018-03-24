#!/bin/sh

set -ex

echo "Called with stage: $1"

echo $(npm install)

echo $(ruby serverless.rb deploy $1 false)