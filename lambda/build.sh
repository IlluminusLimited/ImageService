#!/bin/sh

npm install --production

ruby serverless.rb deploy $1 false