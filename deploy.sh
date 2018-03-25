#!/bin/bash

set -ex

echo "Called with stage: $1"

ruby serverless.rb package $1 false && \
make all && \
serverless deploy --package .serverless

