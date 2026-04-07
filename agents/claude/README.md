# Claude Workspace Notes

This folder keeps Claude-specific context and memory files.

## Structure

- `agents/claude/agents/`:
  Claude-facing agent briefs and prompt docs.
- `agents/claude/agent-memory/`:
  Claude conversation memory artifacts and scratch context.
- `AGENTS.md`:
  Shared repository-wide coding rules (root file).
- `CLAUDE.md`:
  Claude entrypoint (root file) that references this folder.
- `SKILL.md`:
  Project skill definition (root file).

## Convention

- Keep runtime app prompts with runtime code under `agents/*`.
- Keep Claude-only briefs or orchestration notes under `agents/claude/agents/`.
- If a Claude brief mirrors a runtime prompt, add a short note pointing to the runtime source to avoid divergence.
