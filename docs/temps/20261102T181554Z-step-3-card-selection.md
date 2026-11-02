# Step 3 Card Selection Run Record

- **Design Read:** Reviewed `specs/02-ux/design-system.md`, `specs/02-ux/figma-references.md`, card selection requirements/flows, existing GameCard references, and current lobby patterns.
- **Design dials:** Atmospheric horror tone; restrained surface contrast; hierarchy clarity 5/5; responsive density 4/5; motion 2/5; accessible labels and focus states required.
- **Figma access:** Requested player selection frame `2238:2` and Host selection frame `2214:809`; both reads were rate-limited. Implemented to the repository design system and existing card references, and recorded the limitation in the Step 3 report.
- **Implementation:** Completed server commands and role-filtered snapshots, selection UI for players and Host, local drafts, timer, host readiness, post-selection card reveal, and reconnect recovery.
- **Repair cycle 1:** New reveal transport test asserted a deeply nested partial object with a brittle matcher; changed it to assert the public turns state and presence of a Wolf challenge. No product behavior change.
- **Quality gates:** Vitest 13 files/42 tests, root TypeScript, web app TypeScript, Next production build, Playwright E2E, and `git diff --check` all passed.
