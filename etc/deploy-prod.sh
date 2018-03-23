#!/bin/bash

set -e

cd ..
ruby serverless.rb package prod false && \
 make all && \
 sls deploy --package .serverless