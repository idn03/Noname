# Running the backlog workflow

Install and authenticate either the Codex or OpenCode CLI. From the repository
root, use `bash scripts/plan-feature.sh "<epic>"` to create a dependency-ordered plan.
Review and approve that plan before running any stage. Use the matching stage
sheet's command below to run the Coordinator through implementation, review,
test, validation, bounded repair, and checkpoint. Codex is the default provider;
prefix a command with `NONAME_PROVIDER=opencode` to use OpenCode.

The stage command accepts optional `--scope <path>` to focus the agent on a
specification beneath `specs/`, `--model <name>` to select a provider model,
`--verbose` to print the full prompt, and `--dry-run` to inspect the request
without starting a provider. Planning, bug-fix, and archival commands accept
`--model`, `--verbose`, and `--dry-run` as well.

## Stage prompts

- [B-001](b-001-application-foundation.md):
  `bash scripts/implement-feature.sh "B-001 — Application Foundation"`
- [B-002](b-002-game-engine-foundation.md):
  `bash scripts/implement-feature.sh "B-002 — Game Engine Foundation"`
- [B-003](b-003-static-game-content.md):
  `bash scripts/implement-feature.sh "B-003 — Static Game Content"`
- [B-004](b-004-player-identity-and-lobby.md):
  `bash scripts/implement-feature.sh "B-004 — Player Identity and Lobby"`
- [B-005](b-005-host-controls-and-team-assignment.md):
  `bash scripts/implement-feature.sh "B-005 — Host Controls and Team Assignment"`
- [B-006](b-006-personal-card-selection.md):
  `bash scripts/implement-feature.sh "B-006 — Personal Card Selection"`
- [B-007](b-007-attack-defense-and-challenges.md):
  `bash scripts/implement-feature.sh "B-007 — Attack, Defense, and Challenges"`
- [B-008](b-008-scoring-and-results.md):
  `bash scripts/implement-feature.sh "B-008 — Scoring and Results"`
- [B-009](b-009-realtime-reliability-and-privacy.md):
  `bash scripts/implement-feature.sh "B-009 — Realtime Reliability and Privacy"`
- [B-010](b-010-browser-acceptance.md):
  `bash scripts/implement-feature.sh "B-010 — Browser Acceptance"`

## Other prompts

- Bug investigation and gated repair:
  `bash scripts/fix-bug.sh "<bug description and reproduction>"`
- Archive after a successful full run:
  `bash scripts/run-archivist.sh "<run result path or summary>"`

Each command accepts one quoted request. The scripts do not claim a pass based
on provider text alone; the Coordinator must supply executed check evidence and
halt when a required check or checkpoint is unavailable.
