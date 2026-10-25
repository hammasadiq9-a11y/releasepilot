# ReleasePilot agent instructions

You are helping build ReleasePilot, a release-readiness assistant for software teams.

## Product principles
- Never auto-approve, merge, or deploy code. Keep a human as the release decision-maker.
- Distinguish observed evidence from heuristic guesses. State limitations and possible false positives.
- Prefer small, tested changes with clear verification steps.
- Do not add secret values, personal data, or proprietary example code to fixtures.
- Never claim GitLab Duo Agent Platform was used unless a real Duo flow/session was run and documented.

## Review priorities
1. Security: secrets, unsafe HTML, disabled TLS verification, injection surfaces.
2. Reliability: swallowed errors, missing failure paths, risky changes.
3. Test coverage and release notes.
4. Clear, actionable findings with severity and evidence.

## Workflow
- Run `npm test` and `npm run build` for code changes.
- Explain what was tested and what was not.
- For a release decision, use "ready for human review", never "safe to ship".
