# Motion playground

[Open the live playground](https://mad7droid.github.io/mad-ux-motion/).

Three sample pages demonstrate six interactions in settings, publishing, help, inbox, and workflow interfaces. Each example has a working preview, a configurable prompt for your coding agent, and a copyable CSS recipe. The prompts use the skill's name rather than a tool-specific command, so they can be pasted into either supported agent after installation.

| Page | Examples | What to try |
| --- | --- | --- |
| [Feedback](../examples/index.html) | Press feedback, status toast | Hold a press; show, dismiss, and immediately show the toast again |
| [Surfaces](../examples/surfaces.html) | Native dialog, disclosure | Use Tab and Escape; rapidly toggle the disclosure |
| [Gestures](../examples/gestures.html) | Drag-to-dismiss, reversible movement | Drag a short distance, drag past the threshold, cancel, or reverse mid-transition |

## Appearance

Use the System, Light, and Dark controls in the top bar. System follows live operating-system changes; an explicit selection is remembered across pages and visits. If browser storage is blocked, the selection still works for the current page. Appearance is applied before the stylesheet loads to avoid a flash of the wrong theme.

Both themes use shared surface, text, border, focus, and feedback tokens. The palette is neutral with teal reserved for feedback; there are no purple accents or gradients. The demo interfaces, dialog, prompts, and code areas follow the selected theme.

The developer-workspace structure draws on [Browserbase](https://mobbin.com/screens/118eaf24-c380-4f66-818b-8813c59361f5) and [Hume AI](https://mobbin.com/screens/94d11379-cad3-4bef-b8c3-7a972799a07f) screens viewed on Mobbin: compact navigation and toolbars around a working area. The palette, demo content, and appearance controls are specific to this playground.

## Configuration

- **Reset:** restores the motion controls without changing appearance.
- **Duration:** 80–400ms enter timing; exits use 75% of the selected value. The broad range is for comparison, not a recommendation to use 400ms for ordinary UI.
- **Easing:** decelerate/accelerate, standard, or linear for comparison.
- **Travel:** 0–32px for the toast only; disabled on pages without a toast. The gesture uses actual pointer distance, and the marker uses its measured track width.
- **Motion preference:** follow the operating system or explicitly preview reduced motion. The page never overrides a system request for reduced motion. Reduced mode removes nonessential scale/travel, makes layout and settling immediate, and uses 100ms/80ms fades. Direct manipulation still follows the pointer.

Open **Prompt & CSS recipe** beneath an example to copy its current configuration. The Clipboard API requires HTTPS or localhost; when access is unavailable, the text is selected for manual copying. CSS snippets cover motion styling; use `examples/app.js` for the corresponding state, focus, and gesture logic. They are teaching examples, not standalone accessible component packages.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173 --directory examples --bind 127.0.0.1
```

Open `http://localhost:4173`. The pages are plain HTML, CSS, and JavaScript with no build step, external fonts, or runtime dependencies. A recent browser is recommended. Native dialog focus/dismissal remains functional when newer discrete-transition or starting-style features are unsupported; those browsers may show an immediate entrance or exit.

## Checks

Development-only test dependencies are separate from the buildless examples:

```sh
npm ci --ignore-scripts
npm run check
npm test
python3 scripts/validate.py
```

The DOM tests exercise appearance persistence and live system changes, blocked-storage fallback, reset behavior, configurable prompts, live reduced-motion preferences, toast focus return, disclosure reversals, drag cancellation and reset, and clipboard fallback. They do not render CSS, implement real pointer capture, or validate native dialog focus behavior. Visually inspect desktop and mobile layouts, keyboard navigation, reduced motion, and touch gestures in a browser and on physical hardware before claiming those checks pass.

## Publishing updates

The public playground is served from the repository's `gh-pages` branch. After committing changes to `examples/`, publish that directory from the repository root:

```sh
python3 scripts/publish_examples.py
```

The publisher requires committed examples, publishes only that directory, and appends a snapshot to the existing Pages history. It works after squash merges and rejects a concurrent push rather than overwriting it. It uses the configured Git author identity; owner releases should use the Mad7droid identity in `AGENTS.md`. GitHub Pages must be configured to deploy from `gh-pages` at `/` (root). Deployment status is available under the repository's Actions tab. No credentials belong in the examples directory.
