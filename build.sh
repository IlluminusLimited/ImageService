#!/bin/bash

set -e

cd ${TRAVIS_BUILD_DIR}/lambda
npm install
npm test
cd ${TRAVIS_BUILD_DIR}