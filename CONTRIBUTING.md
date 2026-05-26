# Contributing Guide

This project uses Github Issues for issue tracking and GitHub for version control and collaboration.

Please make sure to review the [Architecture Documentation](ARCHITECTURE.md) to understand the system's design before starting work on complex features.

---

# Quick Start

1. Create a branch: `ts-<number>-short-description`
2. Commit using:

   ```
   <type>: <short description>
   ```

3. Push your branch and open a Pull Request
4. Get review → merge

---

# Core Principles

* Every change must be linked to a Github issue
* All work must go through a Pull Request
* No direct commits to `main`
* Keep changes small and focused
* Design before implementation, especially for backend and bridge components

---

# Issue Guidelines

## General Rule

Issues should describe **what needs to be done**, not prescribe full implementations.

---

## Issue Types

### General Issue

Use when:

* the task affects multiple components
* the scope is unclear or spans multiple areas

### Backend (C++)

Use when:

* working on simulation logic
* performance-critical code
* data models and algorithms

### Frontend

Use when:

* working on UI
* visualization
* user interaction

### Bridge (Tauri)

Use when:

* handling frontend ↔ backend communication
* implementing commands
* serialization / data transfer

---

## Issue Structure

Each issue should include:

### Goal

Short statement of purpose

### Description

Clear explanation of the task

### Acceptance Criteria

* [ ] Define what "done" means

### Notes (optional)

For complex work, include:

* design decisions
* performance considerations
* memory usage
* data structures
* architecture notes

---

## When to Update Issues

* **Before starting:** Add initial understanding and design
* **During work:** Update decisions if things change
* **Before finishing:** Verify acceptance criteria

---

# Branching

Branch names follow the following convention.

```
ts-<number>-short-description
```

### Examples

* `ts-12-road-segment-update`
* `ts-5-ci-setup`

---

# Commit Convention

```
<type>: <short description>
```

### Rules

* Use lowercase types
* Use imperative mood ("add", not "added")
* Keep descriptions concise

### Types

* feat → new feature
* fix → bug fix
* refactor → code improvement
* chore → setup / maintenance
* docs → documentation

### Examples

* `feat: add density update`
* `fix: correct simulation step logic`

---

# Linking to Github Issues

---

Always include the issue ID:

* Branch name → `ts-6-...`
* PR should reference the issue

---

# Pull Requests

* Every PR must be linked to a Github issue
* Clearly describe what changed and why
* Keep PRs small and focused
* Ensure all checks pass
* Use squash merging
* No direct commits to `main`

---

# Code Review Rules

## Backend (C++)

* Reviewed only by the project author
* Must meet performance and correctness expectations
* Design decisions must be validated before merging

## Frontend & Bridge

* Team members can review each other
* Focus on clarity and correctness

---

# Definition of Done

An issue is complete when:

* Code is implemented
* Code is reviewed and approved
* All acceptance criteria are met
* Code is merged into `main`
* Issue is closed in Github

---

# Rules to Follow

* No direct commits to `main`
* No PR without a Linear issue
* Keep changes small and focused
