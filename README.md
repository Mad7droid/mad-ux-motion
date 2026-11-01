# UX Motion

An opinionated agent skill for responsive, accessible UI motion. It helps a coding agent decide **when motion earns its place**, implement it, and review what is already there.

Functional UI starts around **120–180ms**. Your product's motion tokens take precedence. These timings are house preferences, not accessibility requirements.

## Install

The same `skills/ux-motion` folder works in both Codex and Claude Code. `SKILL.md` follows the shared Agent Skills format; `agents/openai.yaml` adds Codex display metadata and Claude Code ignores it.

### Claude Code

Install as a plugin:

```text
/plugin marketplace add Mad7droid/mad-ux-motion
/plugin install ux-motion@mad-ux-motion
```

Or copy the skill folder for personal use (use `.claude/skills` inside a repository to share it with a project):

```sh
git clone https://github.com/Mad7droid/mad-ux-motion.git
mkdir -p ~/.claude/skills
cp -R mad-ux-motion/skills/ux-motion ~/.claude/skills/ux-motion
```

### Codex

```sh
git clone https://github.com/Mad7droid/mad-ux-motion.git
mkdir -p ~/.codex/skills
cp -R mad-ux-motion/skills/ux-motion ~/.codex/skills/ux-motion
```

The copy commands assume `ux-motion` is not already installed. Back up an existing folder before replacing it. If your agent uses a different skills directory, copy the same folder there. There are no runtime dependencies, API keys, or required motion libraries.

## Use it

Invoke the skill explicitly: `$ux-motion` in Codex, `/ux-motion` in Claude Code (`/ux-motion:ux-motion` when installed as a plugin). Claude Code also loads it automatically when a request matches the skill description.

```text
Use $ux-motion to polish this dropdown. Follow our existing tokens,
keep keyboard behavior intact, and support reduced motion.
```

```text
/ux-motion audit the motion in src/components/Drawer.tsx.
Report concrete findings with file and line references before changing code.
```

Automatic discovery depends on your agent. You can also point an agent directly at [SKILL.md](skills/ux-motion/SKILL.md) and ask it to follow the instructions.

## What it covers

| Area | Guidance |
| --- | --- |
| Intent | Frequency, spatial continuity, feedback, when to remove motion |
| Timing | Surface-specific starting points, enter/exit easing |
| Rendering | Named properties, layout costs, careful layer promotion |
| Components | Anchored origins, press and hover states, focus and visibility |
| Accessibility | Reduced-motion alternatives, keyboard access, semantic state |
| Gestures | Pointer ownership, cancellation, scrolling, device verification |
| Continuity | Interrupted transitions, stale cleanup, spring tuning |
| Advanced | Clip paths, 3D, WAAPI, stagger, main-thread pitfalls |
| Review | Evidence-based findings and honest verification limits |

The skill is framework-independent, with web-focused examples. It does not install a component library or guarantee accessibility compliance or smooth performance without testing.

## Try the live examples

[Open the motion playground](https://mad7droid.github.io/mad-ux-motion/) to try six interactive demos across feedback, surfaces, and gestures. Switch between system, light, and dark appearance. Adjust duration, easing, and toast travel; preview reduced motion; then copy the matching prompt or CSS recipe.

Run it locally with `python3 -m http.server 4173 --directory examples`, then open `http://localhost:4173`. No build or runtime dependencies are needed. See [the examples guide](docs/examples.md) for the demo list, testing, and publishing instructions.

## Documentation

- [Usage and example prompts](docs/usage.md)
- [Design choices and improvements](docs/design.md)
- [Behavioral evaluation scenarios](docs/evaluation.md)
- [Skill instructions](skills/ux-motion/SKILL.md)
- [Advanced reference and platform sources](skills/ux-motion/REFERENCE.md)
- [Contributing](CONTRIBUTING.md) · [MIT license](LICENSE)

## Update or remove

Pull changes in your clone and replace the installed skill folder after backing up local edits. Installation is a snapshot, so pulling this repository alone does not update the installed copy. Plugin installs update through `/plugin`. Remove the installed `ux-motion` folder (or uninstall the plugin) to uninstall; application code generated using it is unaffected.

Curated by [Mad7droid](https://github.com/Mad7droid).
