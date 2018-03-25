.PHONY: all image package dist clean

all: image

image:
	docker build --tag amazonlinux:nodejs .
package: image
	rm -rf lambda/node_modules
	docker run --rm --volume ${PWD}/lambda:/build amazonlinux:nodejs npm install --production
dist: package
	mkdir -p .serverless
	cd lambda && zip -FS -q -r ../.serverless/image-service.zip *

clean:
	rm -r lambda/node_modules
	docker rmi --force amazonlinux:nodejs
