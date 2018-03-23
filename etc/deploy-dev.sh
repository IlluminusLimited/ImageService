#!/bin/bash

set -e

cd ..
ruby serverless.rb package dev false
make all
sls deploy --package .serverless