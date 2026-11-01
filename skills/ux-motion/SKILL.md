---
name: ux-motion
description: Design, implement, and review UI motion for transitions, gestures, feedback, and interactive surfaces. Use when adding motion or fixing slow, janky, or distracting interactions. Skip non-visual work and chart animation.
---

# UX motion

Apply these rules while designing and writing the interaction. First inspect project
motion tokens: a repository's `AGENTS.md`, `CLAUDE.md`, token files, and design docs override the
house values below.

<!-- AGENTS_CORE_START -->
## Always-on core

- House decision: functional UI usually lives in a 120–180ms band. Project tokens win.
- Animate for spatial continuity, state change, input feedback, or to avoid a jarring pop.
- Prefer named `transform` and `opacity` transitions. Never use `transition: all`.
- Entering surfaces should decelerate; exiting surfaces should accelerate. Exits can be shorter.
- Start scaled surfaces near `scale(0.96)`, never from `scale(0)`.
- Keep motion replaceable under `prefers-reduced-motion: reduce`; preserve comprehension and keyboard access.
- Capture the pointer for drags, guard secondary touches, and test gestures on hardware.
- Before writing motion or touching a common overlay, read this file in full. Use `REFERENCE.md` only for clip paths, 3D, WAAPI, or performance deep dives.
<!-- AGENTS_CORE_END -->

## 1. Decide whether it earns motion

Use exposure frequency as a constraint: actions repeated constantly should be instant
or nearly so; occasional surfaces can establish spatial continuity; rare, explanatory
moments may carry more personality. Motion must clarify a change, acknowledge input,
preserve location, or prevent a jarring appearance. If it does none of those things,
remove it. Do not make a keyboard shortcut wait for decorative motion.

## 2. Choose a duration

The 120–180ms band is a house decision: it is intentionally tighter than Material 3's
published short3 (150ms), short4 (200ms), and standard transition range (250–400ms).
It expresses a preference against slow functional UI, not a published accessibility
or platform requirement.

| Surface | Starting point |
| --- | ---: |
| Press feedback | 100–140ms |
| Tooltip or tiny popover | 120–160ms |
| Menu or dropdown | 140–180ms |
| Modal | 180ms |
| Sheet | 180ms; up to 250ms when travelling most of the viewport |

Use the shorter end for exits. These are defaults, not overrides for product tokens.

## 3. Choose an easing

An entering surface should arrive with emphasis that settles (decelerate); an exit
should clear promptly (accelerate). Material 3 names these directions explicitly:

```css
:root {
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.05, 0.7, 0.1, 1); /* emphasized-decelerate */
  --ease-exit: cubic-bezier(0.3, 0, 0.8, 0.15); /* emphasized-accelerate */
}
```

Use `linear` only for time-like progress. Use an ease-in-out curve for a state that
travels through a deliberate midpoint. Avoid choosing a curve by name alone: inspect
the plotted shape and the direction of travel.

## 4. Keep it cheap to render

Prefer `transform` and `opacity`, which can stay on the compositor. Name the properties
and keep layout out of the animation. Avoid animating `top`, `left`, `width`, `height`,
margin, or padding unless the layout change is the point and the cost is accepted.
For intrinsic height, a wrapper can transition `grid-template-rows: 0fr` to `1fr`,
with a `min-height: 0` inner wrapper clipped by `overflow: hidden`. This still performs
layout; profile it rather than treating it as a compositor-only shortcut. Use `will-change` late, briefly, and
only after profiling shows it helps; layers consume resources.

## 5. Make states correct

- Give pressable controls visible feedback; use an existing color, border, or shadow state,
  or a small `scale(0.98)` when it fits. Do not overwrite a positioning transform.
- Preserve visible focus, keyboard activation, and disabled behavior. Animation must not
  delay focus placement, Escape handling, or semantic state updates.
- Popovers, menus, and tooltips grow from an anchor via `transform-origin`; centered
  modals grow from center. Keep the origin stable while the state changes.
- Prefer transitions for retriggerable states. Use keyframes for a self-contained event.
- Gate hover-only affordances with `@media (hover: hover) and (pointer: fine)`.
- For an entering element, use `@starting-style` where supported or a mounted state
  that makes the initial style observable before the transition.

## 6. Reduced motion means a replacement

The `prefers-reduced-motion` setting covers motion being removed, reduced, or replaced;
large-scale panning and scaling can be vestibular triggers. Replace travel and scale
with opacity and color changes where those still explain state. Keep focus, loading,
and visibility changes understandable. Do not make an element disappear merely because
the user asked for less motion. Honor this preference in JavaScript-driven animations
as well as CSS, including preference changes while the page is open. Do not depend
on a `transitionend` event to complete an essential state change: the transition may
be disabled or canceled. Scope overrides to the affected component instead of
globally forcing every animation to a tiny duration.

## 7. Gestures

Call `setPointerCapture()` when a drag starts: subsequent pointer events then continue
to target the capturing element until release. Dismiss on a tuned velocity-or-distance
rule; there is no universal flick constant, so calibrate it on the actual device.
Keep movement bounded with damping instead of a hard edge. Ignore additional touch
points once a gesture owns the pointer. Let the user reverse an in-flight gesture. Handle `pointercancel` and
`lostpointercapture` by clearing drag state. Choose `touch-action` for the gesture axis
without unnecessarily blocking page scrolling; provide a button or keyboard equivalent.

## 8. Handle interruption and springs

Rapid open/close/reopen should settle at the latest requested state. Retarget from the
current visual state rather than replaying from the beginning. Cancel stale callbacks,
listeners, and animations on replacement or unmount; an old exit must not remove a
newly reopened surface. Keep hidden or exiting content out of keyboard navigation
according to the component's focus lifecycle.

Use a spring when direct manipulation or continuity benefits from it, respecting the
project's library. Spring parameters vary between engines: do not copy stiffness and
damping values blindly. Tune settling time and overshoot on the actual component;
avoid bounce on text-heavy surfaces and disable travel under reduced motion.

## 9. Verify before calling it done

Replay at 4× slower speed and check that properties finish together and originate from
the right place. Toggle rapidly to expose snapping. Emulate reduced motion in DevTools.
Exercise a drag past its edge, cancel it, add a second touch, and test on a physical
device. For runtime-computed animation values, consult `REFERENCE.md`. State which checks
were actually performed and which require a browser or physical device; code review
alone cannot establish perceived smoothness.

## Review output

When auditing code, report one compact table, most severe first:

| File:line | Now | Change to | Why |
| --- | --- | --- | --- |
| `Menu.tsx:18` | `transition: all 300ms` | named properties and project tokens | avoids accidental layout animation |

Report only findings visible in the code. If the diff is clean, say so rather than
inventing findings.

Curated by mad7droid.
