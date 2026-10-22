# Network Atlas Implementation Plan

> Execution: native, in the new isolated project directory.

**Goal:** Deliver a Turkish React + Tailwind network learning interface and GitHub-ready repository.

**Architecture:** Vite static React app; curriculum in a separate data module, independently testable search/progress model, native dialog for topic detail. No runtime API dependency.

**Tech Stack:** React 19, Tailwind 4, Vite 8, Lucide, Node test runner.

**Spec:** ../specs/2026-10-22-network-atlas-design.md

## Global Constraints

Turkish interface; Apple-inspired system font and calm hierarchy. No fabricated progress. Source attribution must distinguish curated resources from verified roadmap content.

## Review Focus

- Corrupt browser storage must recover without crashing.
- Turkish uppercase I/İ and diacritics must be searchable.
- Bookmarks must combine correctly with category/status filters.
- Dialog focus must be restored after close; Escape must work.
- Empty results and fully completed roadmaps must remain useful.

## Tasks

- [ ] 1. Scaffold and curriculum: create package.json, Vite config, src/data/roadmap.js and public icon. Verify dependency installation and data integrity.
- [ ] 2. Model: write tests for normalizeSearch, filterTopics, parseProgress, getStats, nextTopic; observe failure, implement src/lib/learning.js, run npm test.
- [ ] 3. UI: implement App.jsx, TopicDialog.jsx, main.jsx and styles.css; build roadmap, resources, bookmarks, theme and local persistence; run npm test and npm run build.
- [ ] 4. Delivery: inspect production output, attempt browser preview, document limitations and usage, initialize git, create private GitHub repo and push when access is available. Verify git state and repository result.
