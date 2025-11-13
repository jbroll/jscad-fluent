# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fluent interface wrapper around JSCAD's modeling API for creating and manipulating 2D and 3D geometry. This library provides chainable methods for CAD operations with strong TypeScript support.

## Build and Development Commands

```bash
# Build the project (compiles TypeScript and bundles with Vite)
npm run build
# or
make build

# Run tests
npm test
# or
make test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Development build (regenerates code from templates, then builds)
make dev

# Generate TypeScript files from templates
make gen

# Clean build artifacts
make clean

# Linting and Type Checking
npm run lint              # Run Biome linter
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code with Biome
npm run type-check        # Run TypeScript type checker (app and tests)
npm run type-check:app    # Type check only application code
npm run type-check:tests  # Type check only test code
npm run check             # Run both type-check and lint
npm run check:all         # Run type-check, lint, and tests
```

## Code Generation Architecture

**CRITICAL**: This project uses a template-based code generation system. The files in `src/gen/` are **NOT** hand-written - they are generated from Mustache templates.

### How Code Generation Works

1. **Templates** (`templates/*.template`): Mustache templates that define the structure of wrapper classes
   - `FluentGeom2.template` - 2D geometry wrapper
   - `FluentGeom3.template` - 3D geometry wrapper
   - `FluentPath2.template` - 2D path wrapper
   - `FluentGeom2Array.template`, `FluentGeom3Array.template`, `FluentPath2Array.template` - Array wrappers

2. **Method Definitions** (`templates/methods.json`): JSON file defining all available methods and their signatures
   - `transformMethods` - translate, rotate, scale, mirror, center operations
   - `measurementMethods` - bounding box, volume, area, dimensions
   - `booleanMethods` - union, subtract, intersect
   - `hullMethods` - hull operations
   - `expansionMethods` - expand operations
   - `offsetMethods` - offset operations
   - `extrudeMethods` - 2D to 3D extrusion (extrudeLinear, extrudeRotate)
   - `geom2Methods`, `geom3Methods`, `path2Methods` - geometry-specific operations

3. **Partials** (`templates/*.mustache`): Reusable template fragments for different method types
   - `methodObject.mustache` - methods that modify and return the same type
   - `methodBoolean.mustache` - boolean operations (union, subtract, intersect)
   - `methodExtrude.mustache` - 2D to 3D extrusion operations
   - `methodValue.mustache` - methods that return computed values
   - `methodArray*.mustache` - array operation variants

4. **Generation Process**: `make gen` uses `@jbroll/mustache` CLI to render templates with the method definitions, outputting TypeScript files to `src/gen/`

### Making Changes to Generated Code

**DO NOT** edit files in `src/gen/` directly. Instead:

1. To add/modify methods: Edit `templates/methods.json`
2. To change method implementation patterns: Edit the appropriate partial in `templates/*.mustache`
3. To change class structure: Edit the template files in `templates/*.template`
4. After making template changes, run `make gen` to regenerate the TypeScript files

## Architecture

### Core Wrapper Classes (Generated)

- **FluentGeom2**: Wrapper for 2D geometry (Geom2), supports all 2D operations plus extrusion to 3D
- **FluentGeom3**: Wrapper for 3D geometry (Geom3), supports all 3D operations
- **FluentPath2**: Wrapper for 2D paths (Path2), supports path operations
- **FluentGeom2Array**, **FluentGeom3Array**, **FluentPath2Array**: Array wrappers for batch operations

Each wrapper class:
- Implements the underlying JSCAD geometry interface
- Provides fluent chainable methods by returning `this` for transformations
- Uses `Object.assign()` to mutate the current instance with results from JSCAD functions
- Wraps JSCAD namespace functions (`transforms.*`, `booleans.*`, `measurements.*`, etc.)

### Factory Functions

The main entry point `jscadFluent` (in `src/index.ts`) provides factory functions for creating geometry:
- 2D primitives: `rectangle`, `circle`, `ellipse`, `polygon`, `square`, `star`, `roundedRectangle`
- 3D primitives: `cube`, `sphere`, `cylinder`, `cylinderElliptic`, `torus`, `polyhedron`
- Path primitives: `arc`, `line`

### Method Pattern

All transformation methods follow this pattern:
```typescript
methodName(params): this {
  Object.assign(this, jscadNamespace.methodName(params, this));
  return this;
}
```

Boolean operations accept variadic arguments:
```typescript
union(...others: FluentGeom2[]): this {
  Object.assign(this, booleans.union(this, ...others));
  return this;
}
```

## Testing

Tests use Vitest with the following patterns:
- Test files are in `test/` directory
- Tests are organized by category: `primitives2d.test.ts`, `primitives3d.test.ts`, `primitivesPath2.test.ts`, `hull.test.ts`, `additional.test.ts`
- Use `.toBeCloseTo()` for floating-point comparisons with geometry measurements
- Tests verify both geometry creation and fluent method chaining

## TypeScript Configuration

The project uses **strict TypeScript checking** with the following compiler options:

- `strict: true` - Enable all strict type-checking options
- `noImplicitAny: true` - Error on expressions with implied `any` type
- `noImplicitReturns: true` - Error when not all code paths return a value
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noFallthroughCasesInSwitch: true` - Error on fallthrough in switch statements
- `noUncheckedIndexedAccess: true` - Array access returns potentially undefined
- `exactOptionalPropertyTypes: true` - Require exact optional property types

**Separate configs:**
- `tsconfig.json` - Application code (excludes tests)
- `tsconfig.test.json` - Test code (relaxes `noUnusedLocals` and `noUnusedParameters`, adds vitest globals)

When accessing arrays with strict checking enabled, remember that `array[index]` returns `T | undefined`. Use optional chaining (`?.`) or explicit undefined checks.

## Linting Configuration

The project uses **Biome** (not ESLint) for linting and formatting:

**Key lint rules:**
- `noExplicitAny: error` - Disallow explicit `any` types (except with biome-ignore comments in generated code)
- `noNonNullAssertion: warn` - Warn on non-null assertions
- `noUnusedFunctionParameters: warn` - Warn on unused parameters

**Overrides:**
- Test files: Allow `any` types and unused parameters
- Templates directory: Linting and formatting disabled (since these are Mustache templates)

**Important:** Generated files in `src/gen/` may contain biome-ignore comments for legitimate use of `any` types required by the JSCAD geometry interfaces.

## Dependencies

- **@jscad/modeling**: Peer dependency - the underlying JSCAD library that this wraps
- **@jbroll/mustache**: Template engine for code generation (dev dependency)
- **vite**: Build tool for bundling
- **vitest**: Test runner
- **typescript**: Type checking and compilation
- **@microsoft/api-extractor**: For generating consolidated type definitions
