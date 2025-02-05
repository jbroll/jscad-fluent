
.PHONY: dev build test deploy clean

dev:
	npm run dev

size: build
	
build:
	npm run build

test:
	npm test

deploy: force
	bash -x ./deploy/deploy.sh

clean:
	rm -rf dist

force:

