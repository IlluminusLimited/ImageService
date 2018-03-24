#!/bin/bash

set -ex

echo "Called with stage: $1"

make all

docker run --volume ${PWD}/lambda:/build amazonlinux:nodejs npm install

docker run --volume ${PWD}/lambda:/build amazonlinux:nodejs ruby serverless.rb package $1 false

docker run --rm --volume ${PWD}/lambda:/build amazonlinux:nodejs serverless deploy --stage $1