# ADR 001: Monorepo Structure with Turborepo

## Status

Accepted

## Context

We need to maintain two separate mobile applications (rider and driver) that share significant code including:
- UI components
- Business logic
- API clients
- Type definitions
- Configuration

## Decision

We will use a Turborepo monorepo with pnpm workspaces.

### Structure

- `apps/` - Deployable applications
- `packages/` - Shared libraries

### Benefits

1. **Code sharing** - Shared packages reduce duplication
2. **Consistent tooling** - Single ESLint, Prettier, TypeScript config
3. **Cached builds** - Turborepo caches unchanged packages
4. **Atomic changes** - Changes across apps and packages in single PR

## Consequences

- Increased initial setup complexity
- Need to manage workspace dependencies carefully
- Metro bundler configuration for monorepo support
