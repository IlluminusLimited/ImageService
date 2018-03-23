#!/bin/bash

set -e

ruby serverless.rb package prod false
make all
sls deploy --package .serverless