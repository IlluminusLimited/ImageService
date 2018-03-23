#!/bin/bash

set -e

ruby serverless.rb package dev false
make all
sls deploy --package .serverless