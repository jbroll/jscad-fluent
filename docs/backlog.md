# Backlog

## Publish dependencies before the next release

npm has no `@jbroll/jscad-anchors`, and its latest `@jbroll/jscad-modeling`
is 2.13.3, below the `^2.13.4` peer range. Publish both before publishing
jscad-fluent, or npm consumers can't satisfy the peers.
