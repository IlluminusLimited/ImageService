#!/bin/sh

set -ex

echo "Called with stage: $1"

npm install -g serverless

npm install -g serverless-pseudo-parameters

npm install -g serverless-step-functions

npm install --production

ruby serverless.rb deploy $1 false