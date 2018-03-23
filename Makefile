.PHONY: all image package dist clean

all: dist

image:
	docker build --tag amazonlinux:nodejs .
# Create the entire serverless stack inside docker and deploy it.
# AKA, use this makefile, or a bash script to call docker and run serverless commands
package: image
	docker run --rm --volume ${PWD}/lambda:/build amazonlinux:nodejs npm install --production

dist: package
	mkdir -p .serverless
	cd lambda && zip -FS -q -r ../.serverless/image-service.zip *

clean:
	rm -r lambda/node_modules
	docker rmi --force amazonlinux:nodejs
