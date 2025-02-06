
.PHONY: dev build test deploy clean

dev:
	npm run start

size: build
	
build:
	npm run build --verbose

test:
	npm test

deploy: force
	bash -x ./deploy/deploy.sh

clean:
	rm -rf dist

force:

