# CLAUDE.md

Project documentation lives in `README.md` and `docs/`: `architecture.md` for
code generation and the wrapper design, `development.md` for commands and
workflow, `user-manual.md` for the API. Put new project documentation there,
not here.

## Rules

- Never edit `src/gen/`. Change `templates/`, then run `make gen` and
  `npm run lint:fix`.
- Import runtime modeling functions from `@jbroll/jscad-anchors`, never from
  `@jscad/modeling`. Type imports from `@jscad/modeling` are fine.
- An API change updates `docs/user-manual.md` and `llm.txt` in the same commit.
- Run `npm run check:all` before committing.
