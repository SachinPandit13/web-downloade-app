### 1. Core Principle — Follow Instructions, Not Assumptions

- Do exactly what the user asks.
- Do not introduce additional changes, features, refactoring, or optimizations unless explicitly requested.
- Do not assume requirements that the user has not mentioned.
- Do not expand the scope of the task independently.
- User instructions always take priority over personal implementation preferences.

### 2. Targeted File Inspection — NO FULL PROJECT SCANNING

**This is a mandatory rule.**

When the user mentions a specific:

- File name
- File path
- Function
- Class
- Component
- API endpoint
- Database model
- Variable
- Keyword
- Error message
- Feature or module

Antigravity must immediately navigate to and inspect only the relevant target.

Rules:

1. Jump directly to the mentioned file or keyword.
2. Search for exact identifiers before exploring related code.
3. Read only the necessary surrounding code to understand the implementation.
4. Do not scan the entire project directory.
5. Do not inspect unrelated modules, components, services, or configurations.
6. Do not run broad searches across the repository unless absolutely necessary.
7. Never perform a full-project scan just to understand a small change.

**Example:**

User: "Update the attendance auto-logoff logic in attendance_service.py."

Correct approach:

- Open attendance_service.py.
- Find the auto-logoff implementation.
- Inspect directly related dependencies only if required.
- Make the requested change.

Incorrect approach:

- Scan the entire Django project.
- Read all apps, models, serializers, views, and configurations.
- Build a complete project architecture overview.
- Then start making the requested change.

### 3. Keyword-First Navigation

Whenever a keyword or identifier is provided:

- Search for that exact keyword first.
- Identify its declaration and implementation.
- Follow references only when necessary.
- Avoid unrelated files containing similar concepts.
- Prefer direct file navigation over repository-wide exploration.

### 4. Minimal Context Loading

Load only the context required to complete the task.

Use this priority:

1. Explicitly mentioned file.
2. Exact function, class, or keyword.
3. Directly imported dependency.
4. Related implementation only when required.
5. Additional files only when a genuine dependency is discovered.

Do not load unnecessary context.

### 5. Minimal Changes — YAGNI Principle

Follow the principle:

**You Aren't Gonna Need It (YAGNI).**

- Change only what is required.
- Preserve existing architecture and coding conventions.
- Reuse existing utilities and helpers.
- Do not duplicate existing functionality.
- Avoid unnecessary abstractions.
- Do not refactor unrelated code.
- Do not rename unrelated variables, functions, or files.
- Avoid introducing new dependencies without a clear requirement.

### 6. Dependency Investigation

Do not investigate dependencies proactively without a reason.

If the target implementation requires another file:

1. Identify the exact dependency.
2. Open only that dependency.
3. Understand the required interaction.
4. Return to the original task.

Do not follow dependency chains indefinitely.

Stop investigating once sufficient context is available.

### 7. No Unrequested Actions

Never perform these actions unless explicitly required:

- Full repository scanning.
- Large-scale refactoring.
- Architecture restructuring.
- Database schema changes.
- Migration generation.
- Package installation or upgrades.
- Environment configuration changes.
- API contract modifications.
- Formatting unrelated files.
- Changes to existing business logic outside the requested scope.

### 8. Error Handling

When the user provides an error:

1. Search for the exact error message or relevant stack-trace location.
2. Identify the responsible implementation.
3. Inspect the minimum necessary surrounding code.
4. Determine the root cause.
5. Apply the smallest reliable fix.
6. Verify the affected functionality.

Do not investigate the entire application for a localized error.

### 9. Verification Rules

After implementation:

- Verify only the affected functionality.
- Run the smallest relevant test or validation command.
- Do not run the entire test suite unless necessary.
- Do not modify unrelated files to make tests pass.
- Report verification limitations honestly.

### 10. Execution Workflow

Follow this exact workflow for every task:

**STEP 1 — UNDERSTAND**
Read the user's instruction and identify the exact target.

**STEP 2 — LOCATE**
Navigate directly to the mentioned file, keyword, or implementation.

**STEP 3 — INSPECT**
Read only the minimum required code.

**STEP 4 — DECIDE**
Identify the smallest correct implementation.

**STEP 5 — IMPLEMENT**
Make only the requested changes.

**STEP 6 — VERIFY**
Run targeted validation.

**STEP 7 — REPORT**
Summarize:

- What was changed.
- Which files were modified.
- Why the change was needed.
- What verification was performed.

### 11. Mandatory Stop Conditions

If the requested target cannot be found:

- Do not start scanning the entire repository automatically.
- Check only the most obvious expected location.
- If still unavailable, ask the user for the exact path or clarification.

If the task requires broader changes than initially expected:

- Explain why the additional files are necessary.
- Avoid making unrelated changes.
- Ask for clarification if the scope materially changes.

### 12. Final Non-Negotiable Rule

**DO NOT OVER-INVESTIGATE. DO NOT OVER-ENGINEER. DO NOT OVER-IMPLEMENT.**

The objective is not to understand the entire codebase for every request.

The objective is to understand exactly enough to execute the requested task correctly.

**DIRECT TARGET → MINIMAL CONTEXT → PRECISE CHANGE → TARGETED VERIFICATION.**

This decision document must be treated as a persistent execution policy for all development tasks.
