# GitLab setup and Duo Agent Platform workflow

ReleasePilot currently contains a browser-only prototype and a local heuristic review engine. It does not yet connect to GitLab APIs or invoke an LLM. Do not describe the current demo as an active AI agent.

## 1. Import the repository

1. Create/import this project into a GitLab namespace where you have permission to work.
2. Keep the project public if required by the event rules.
3. Confirm the project license and repository history meet the hackathon requirements.
4. Add `.gitlab-ci.yml` and verify the pipeline runs.

## 2. Enable CI checks

- Run the test and build job included in `.gitlab-ci.yml`.
- Enable GitLab SAST and secret detection using the templates supported by your GitLab version and plan.
- Review the pipeline results and fix failures before recording a demo.
- Do not store tokens in source code. Use protected, masked CI/CD variables for any future integration.

## 3. Use GitLab Duo Agent Platform meaningfully

1. Confirm GitLab Duo Agent Platform and the required flows are enabled for the namespace/project. Access depends on GitLab plan, settings, and permissions.
2. Open **AI > Flows** in the project and enable the Code Review Flow if available.
3. Open a merge request containing a meaningful code change and trigger the Code Review Flow.
4. Ask the flow to review security, reliability, tests, and release risk. Keep its feedback and session/pipeline evidence.
5. Validate the agent's findings against tests and source code. Record false positives and what a human changed.
6. Capture a truthful demo of the real flow and its effect on the review process.

Official documentation:
- https://docs.gitlab.com/user/duo_agent_platform/
- https://docs.gitlab.com/user/duo_agent_platform/flows/execution/
- https://docs.gitlab.com/user/get_started/get_started_agent_platform/

## 4. Submission evidence

Before submission, ensure you have:
- A public repository with meaningful commit history and the required license.
- A working pipeline with visible run history.
- A real GitLab Duo Agent Platform flow run, not just a static mockup.
- A short demo showing the change, pipeline, agent review, and human release decision.
- A clear note distinguishing implemented functionality from planned integrations.

## Known limitations

- Current risk score is an illustrative heuristic, not a validated security score.
- No GitLab webhook, merge request API, LLM inference, SAST engine, or deployment integration is active in this prototype.
- Never paste private source code or real secrets into the public demo.
