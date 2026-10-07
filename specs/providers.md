# Provider boundary

## Provider adapter

An adapter starts one provider run, supplies the agent request, collects
provider output, reports process outcome, and converts it into the shared agent
result contract.

The core workflow knows only the adapter interface and shared contracts.

## Required adapter capabilities

- accept a working directory and agent request;
- pass the request without changing its intent;
- capture standard output, standard error, and exit status;
- preserve cancellation and timeout outcomes;
- return structured results or an explicit unavailable or failure result;
- avoid provider-specific assumptions in core orchestration.

## Codex adapter

The Codex adapter invokes the Codex command-line provider in the requested
working directory and maps machine-readable output and process status to the
shared result contract.

## OpenCode adapter

The OpenCode adapter invokes the OpenCode command-line provider in the
requested working directory and maps machine-readable output and process status
to the shared result contract.

## Common behavior

- Provider selection is configuration at the boundary.
- The same request must be usable by either adapter.
- Authentication, model choice, and provider flags remain adapter concerns.
- Provider failures do not become workflow passes.
- Adapter output is retained for diagnosis without entering core semantics.

## Adapter verification

Each adapter is checked for request delivery, working-directory control, success
mapping, failure mapping, timeout or cancellation mapping, and malformed output
handling.
