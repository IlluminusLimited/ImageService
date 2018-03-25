#!/bin/bash

set -ex

echo "Called with stage: $1"

make all && \
ruby serverless.rb create_domain $1 false && \
ruby serverless.rb deploy $1 false

