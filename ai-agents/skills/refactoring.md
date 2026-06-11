# Refactoring Skill

## Purpose

Improve internal code quality through small, behavior-preserving changes with
explicit baseline, verification, and rollback evidence.

## Core Principles

1. Repository instructions and local consistency take precedence over generic
   language guidance.
2. Refactoring changes structure, not approved behavior.
3. A refactor starts from a passing baseline and ends with equivalent evidence.
4. Small transformations are easier to review, diagnose, and reverse.
5. Prefer automated enforcement over prose-only style rules.
6. Refactor demonstrated maintenance problems; do not create abstractions for
   hypothetical reuse.

## Required Workflow

### 1. Discover

* Read `AGENTS.md` and all applicable nested instruction files.
* Detect languages, frameworks, package managers, formatters, linters, type
  checkers, test runners, build tools, and CI commands from repository files.
* Read the relevant architecture and contribution documentation.
* Inspect current working-tree changes and preserve unrelated work.

### 2. Define the Contract

Document:

* Refactor target and out-of-scope areas
* Observable behavior and public interfaces to preserve
* Data, storage, API, accessibility, performance, and security contracts
* Existing tests and missing characterization coverage
* Expected maintainability improvement

### 3. Establish the Baseline with Tester Agent

The Tester Agent must record:

* Exact commands and scenarios
* Environment assumptions
* Passing, failing, skipped, and flaky checks
* Existing known defects that are not part of the refactor
* Representative outputs needed for equivalence comparison

Do not start a risky refactor while the relevant baseline is unexplained.

### 4. Refactor in Small Steps

For each step:

1. Make one coherent structural change.
2. Run the narrowest relevant automated check.
3. Inspect the diff for accidental behavior changes.
4. Keep or revert the step based on evidence.

Typical safe transformations include:

* Rename for intent
* Extract or inline a function, method, variable, or module
* Remove proven duplication or dead code
* Replace deep nesting with guard clauses
* Separate pure logic from side effects
* Move code to the module that owns the responsibility
* Clarify dependency direction
* Encapsulate mutable state
* Split files or modules that have multiple unrelated reasons to change

### 5. Verify Independently

The Tester Agent reruns the baseline and adds targeted exploratory checks for
the changed structure. The Reviewer Agent assesses non-trivial changes for
maintainability, architecture, security, and unnecessary abstraction.

### 6. Capture Learning

When a recurring Developer Agent pattern caused the refactor, record:

* Concrete examples
* Frequency or recurrence evidence
* Maintenance or defect impact
* Existing instruction gap
* Proposed concise, testable instruction
* Automated check that should enforce it, when possible

Update Developer Agent instructions only after approval. Prefer changing a
shared quality document or tool configuration when the rule applies to all
coding agents.

## Codebase Organization Guidance

Use these principles across languages:

* Organize around cohesive responsibilities or product capabilities.
* Keep entrypoints thin; move domain logic into testable modules.
* Keep dependency direction explicit and avoid circular dependencies.
* Separate domain logic, I/O, UI, infrastructure, configuration, and tests.
* Place tests near the ownership boundary used by the repository.
* Keep public APIs small and intentional; hide implementation details.
* Avoid generic `utils`, `helpers`, or `common` dumping grounds.
* Use one authoritative source for configuration and domain constants.
* Prefer composition and explicit data flow over hidden global state.
* Record intentional architecture exceptions.

## Language and Ecosystem Guidance

Always prefer the repository's formatter, linter, and conventions.

### JavaScript and TypeScript

* Use modules with explicit imports and exports.
* Keep browser or framework side effects at composition boundaries.
* Prefer pure domain functions and small DOM/UI adapters.
* Avoid circular imports and mutable exported state.
* Use ESLint or typescript-eslint and the configured formatter.
* For TypeScript, use types to model contracts; avoid broad `any` escapes.

### Python

* Follow project configuration first, then PEP 8 and PEP 257.
* Keep modules cohesive and imports explicit.
* Use type hints for public or non-obvious contracts where the project supports
  them.
* Prefer Black/Ruff or the configured equivalent over manual formatting.
* Do not break compatibility merely to satisfy a style preference.

### Java

* Follow the configured build, formatter, and static-analysis tools.
* Keep packages aligned with cohesive ownership.
* Prefer explicit dependencies, immutable values, and narrow interfaces.
* Avoid large service classes and inheritance used only for reuse.

### C#

* Follow `.editorconfig` and official .NET naming and layout conventions.
* Keep nullable-reference and async contracts explicit.
* Prefer dependency injection at application boundaries and small cohesive
  types.
* Avoid blocking asynchronous code and hidden global service access.

### Go

* Treat `gofmt` as authoritative.
* Keep packages small and named by responsibility.
* Accept interfaces at the consumer boundary; do not create speculative
  interfaces.
* Return and handle errors explicitly; keep concurrency ownership clear.

### Rust

* Treat `rustfmt`, `clippy`, and Cargo checks as authoritative.
* Keep crates and modules cohesive with explicit public surfaces.
* Use the type system for invariants without making APIs unnecessarily complex.
* Prefer ownership clarity over cloning or broad interior mutability.

## Refactor Smell Evidence

A smell is a prompt to investigate, not automatic permission to edit. Useful
evidence includes:

* Repeated logic with the same business reason to change
* High cyclomatic or cognitive complexity
* Frequent changes across unrelated responsibilities
* Circular or unstable dependency direction
* Large modules with weak cohesion
* Hidden shared mutable state
* Difficult test setup caused by mixed concerns
* Repeated defects in the same boundary
* Dead code confirmed by search, tooling, and tests

## Forbidden Shortcuts

* No broad formatting mixed with semantic restructuring.
* No dependency upgrades unless separately approved.
* No snapshot replacement without explaining changed output.
* No test deletion or weakened assertions to obtain green checks.
* No metric chasing that reduces clarity.
* No abstraction solely to satisfy DRY when concepts differ.
* No "cleanup while here" outside the approved scope.

## Required Output

### Refactor Report

* Scope
* Motivation and evidence
* Preserved contracts
* Changed files and structural changes
* Baseline commands and results
* Post-refactor commands and results
* Reviewer and Tester Agent findings
* Risks and rollback
* Developer Agent instruction proposal, if any

## Primary References

* Martin Fowler, Refactoring:
  `https://martinfowler.com/books/refactoring.html`
* Python PEP 8:
  `https://peps.python.org/pep-0008/`
* Effective Go:
  `https://go.dev/doc/effective_go`
* Rust API Guidelines:
  `https://rust-lang.github.io/api-guidelines/`
* Microsoft .NET coding conventions:
  `https://learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions`
* Google Java Style Guide:
  `https://google.github.io/styleguide/javaguide.html`
* Google JavaScript Style Guide:
  `https://google.github.io/styleguide/jsguide.html`
* typescript-eslint rules:
  `https://typescript-eslint.io/rules/`
