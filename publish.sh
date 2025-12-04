#!/bin/sh
#
	npm version patch
	npm publish
	curl -s https://purge.jsdelivr.net/npm/@jbroll/jscad-fluent

