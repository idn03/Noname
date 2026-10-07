## Error Handling

Do not silently ignore errors.

Use domain-specific errors when appropriate.

Expected user errors and unexpected system errors must be distinguishable.

Client-facing errors should contain stable codes and safe messages.

Do not expose stack traces or internal database information to clients.