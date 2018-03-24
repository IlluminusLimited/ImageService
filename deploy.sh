#!/bin/bash

set -ex

echo "Called with stage: $1"

make all

docker run --rm --volume ${PWD}/lambda:/build amazonlinux:nodejs sh build.sh $1