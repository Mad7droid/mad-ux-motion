# Using UX Motion

Give the agent the component, intended behavior, and constraints. Examples use Codex's `$ux-motion`; in Claude Code, start the prompt with `/ux-motion` (or `/ux-motion:ux-motion` for the plugin) instead or just describe the motion task. Mention existing tokens or the animation library if they are not obvious in the repository. The agent should inspect project instructions before applying house defaults.

## Implement an interaction

```text
Use $ux-motion on our settings popover. It opens from the trigger,
closes with Escape, and should tolerate rapid toggles. Reuse existing
tokens and primitives. Explain the reduced-motion behavior and checks run.
```

Expected result: named transition properties, an origin at the trigger, prompt state and focus handling, and a reduced-motion alternative. The skill does not replace your overlay primitive's accessibility behavior.

## Diagnose a gesture

```text
Use $ux-motion to inspect this swipe-to-dismiss sheet. It gets stuck
when the browser takes over scrolling. Keep vertical page scrolling
working and preserve the close button as an alternative.
```

Expected result: inspect pointer ownership, capture loss and cancellation, touch-action, bounds, and cleanup. Velocity thresholds need testing on the actual device.

## Review existing code

```text
Use $ux-motion to review this diff. Report only observable motion issues,
most severe first, with file:line, current behavior, proposed change, and why.
Do not change code yet.
```

Expected result: a compact findings table, or a clean review. Browser and device checks should be distinguished from code inspection.

## Give feedback

If the result feels wrong, describe a reproducible interaction: “open, close, then reopen before the exit finishes.” Include a recording if available, browser/device, motion preference, relevant tokens, and the smallest component that reproduces it. Never include secrets or private customer data in a public issue.

## Installation troubleshooting

- Not discovered: confirm the installed folder (`~/.claude/skills/ux-motion` or `~/.codex/skills/ux-motion`) contains `SKILL.md` directly, not another nested `ux-motion` folder. In Claude Code, `/plugin` shows whether the plugin is enabled. Start a new agent session and invoke it explicitly.
- Different output across agents: skill loading and tool capabilities vary. Supply the file path directly and ask the agent to confirm it read it.
- Existing house style: project tokens override the suggested timings. Ask for specific departures explicitly.
- Native platform: use the decision principles with platform APIs; the CSS and Pointer Events examples are web-specific.
