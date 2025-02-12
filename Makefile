
.PHONY: dev build test deploy clean gen

TMPL = templates
GEN = src/gen

TEMPLATES = $(wildcard $(TMPL)/*.template)
PARTIALS = $(wildcard $(TMPL)/*.mustache)
TS_FILES = $(patsubst $(TMPL)/%.template,$(GEN)/%.ts,$(TEMPLATES))


dev: gen
	npm run build

size: build
	
build:
	npm run build --verbose

test:
	npm test

deploy: force
	bash -x ./deploy/deploy.sh

clean:
	rm -rf dist
	rm -rf $(GEN)

force:

	
gen: $(GEN) $(TS_FILES)

$(GEN):
	mkdir -p $(GEN)

$(GEN)/%.ts: $(TMPL)/%.template $(TMPL)/methods.json $(PARTIALS) | $(GEN)
	npx mustache $(TMPL)/methods.json $< $@ -P templates --no-escapes

