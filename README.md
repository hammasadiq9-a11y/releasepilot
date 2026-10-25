# ReleasePilot

**Release intelligence for safer software delivery.**

ReleasePilot is a prototype that helps developers inspect code changes before merge. It brings potential risk signals, readiness context, and CI expectations into one calm review workflow.

## Current prototype

- Responsive release-readiness dashboard.
- Paste a unified diff or source snippet, or upload a small text file.
- Local heuristic checks for hard-coded secrets, debug output, unsafe HTML rendering, disabled TLS verification, TODO/FIXME markers, and empty catch blocks.
- Severity-ranked findings with evidence lines and actionable explanations.
- A human-in-the-loop review flow: it never approves, merges, or deploys.
- Unit tests and a GitLab CI pipeline for test/build verification.

> **Important:** the current review engine is rule-based and runs locally in the browser. It is not an LLM, a complete security scanner, or proof that code is safe. Findings can be false positives or missed issues. The GitLab Duo Agent Platform integration is a documented next step, not yet active in this prototype.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm test
npm run build
```

## Use the review tool

1. Open **New review** or **Latest review**.
2. Paste a unified diff or source snippet into the editor.
3. Select **Run review**.
4. Inspect each finding and validate it against the full code and test results.
5. Use CI and human review to make the actual release decision.

The sample diff is intentionally synthetic and includes a fake demo secret. Never replace it with a real credential.

## GitLab and AI workflow

See [`docs/GITLAB_SETUP.md`](docs/GITLAB_SETUP.md) for the setup plan to import the project into GitLab, run CI checks, enable security scanning, and use GitLab Duo Agent Platform's Code Review Flow with real session evidence.

## Stack

- React + TypeScript + Vite
- Lucide icons
- Vitest unit tests
- GitLab CI/CD starter pipeline

## Roadmap

- [ ] Connect GitLab merge requests and pipeline status.
- [ ] Add a server-side review service with explicit provider configuration.
- [ ] Run GitLab Duo Code Review Flow and attach real findings/session evidence.
- [ ] Correlate tests, SAST, secret detection, and review feedback.
- [ ] Export a release-readiness report with evidence and human sign-off.

## License

MIT. See [`LICENSE`](LICENSE).
