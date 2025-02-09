
.PHONY: dev build test deploy clean gen

GEN=FluentGeom2.ts \
	FluentGeom3.ts

dev: gen
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
	rm -rf src/gen

force:

	
TMPL = templates
GEN = src/gen

TEMPLATES = $(wildcard $(TMPL)/*.template)
PARTIALS = $(wildcard $(TMPL)/*.mustache)
TS_FILES = $(patsubst $(TMPL)/%.template,$(GEN)/%.ts,$(TEMPLATES))

gen: $(GEN) $(TS_FILES)

$(GEN):
	mkdir -p $(GEN)

$(GEN)/%.ts: $(TMPL)/%.template $(TMPL)/methods.json $(PARTIALS) | $(GEN)
	npx mustache $(TMPL)/methods.json $< $@ -P templates --no-escapes

