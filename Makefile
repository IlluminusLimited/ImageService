.PHONY: all image package dist clean

all: image

image:
	docker build --tag amazonlinux:nodejs .
# Create the entire serverless stack inside docker and deploy it.
# AKA, use this makefile, or a bash script to call docker and run serverless commands

clean:
	rm -rf lambda/node_modules
	docker rmi --force amazonlinux:nodejs
