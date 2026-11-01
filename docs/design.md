# Design choices

## Keep the entry point small

`SKILL.md` holds decisions needed in ordinary work. `REFERENCE.md` contains conditional topics such as clip paths and WAAPI. Repository documentation helps people install and evaluate the skill without expanding the agent's default instructions.

## Product tokens win

The 120–180ms band expresses a preference for fast functional UI. It is not a universal standard. Large travel distances, repeated actions, platform conventions, and an established design system can justify different choices.

## Improvements in this public edition

- Narrower discovery description: activates for motion work without claiming every edit to an overlay.
- Explicit keyboard and focus preservation, including hidden and exiting content.
- Gesture cancellation, capture loss, scroll-axis decisions, and alternatives to dragging.
- Interruption handling so an old exit callback cannot remove a reopened surface.
- Reduced-motion handling for JavaScript, live preference changes, and state completion without transition events.
- Spring tuning by engine and component instead of universal stiffness values.
- Performance claims qualified: intrinsic-height transitions still perform layout; clip-path compositing depends on the browser.
- Press feedback respects existing styles and positioning transforms.

## Useful future work

Add a small interactive fixture for interrupted overlays, reduced motion, and gesture cancellation once there is a maintained browser-test setup. Add framework-specific recipes only when a real integration needs them. Record behavioral evaluations across agents before claiming cross-agent compatibility. Prefer demonstrated fixes over accumulating rules.
