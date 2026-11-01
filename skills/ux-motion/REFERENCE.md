# UX motion reference

Load only the section needed for the task.

## Clip paths

`clip-path: inset(top right bottom left)` removes content from each edge and is useful
for a reveal without changing layout. A fully hidden left-to-right state is
`inset(0 100% 0 0)`; the visible state is `inset(0)`. For a comparison slider, stack
the two images and drive the top image's right inset from the slider percentage.
Measure the actual geometry in JavaScript when the clip boundary depends on a runtime
rect; keep the animated property itself on the clipped element.

## 3D transforms

Set `transform-style: preserve-3d` on the parent when children need depth. Compose
`rotateX`, `rotateY`, and `translateZ` deliberately, and remember that `scale()` also
scales text, borders, and descendants. Reserve 3D for a readable spatial metaphor,
not as a default transition technique.

## Web Animations API

Use WAAPI when the target value is computed at runtime but the animation is otherwise
simple CSS motion. It avoids adding a motion library. Compositing depends on the property and browser;
`clip-path` is not guaranteed to stay on the compositor:

```js
node.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }],
  { duration: 160, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', fill: 'forwards' },
);
```

Keep a handle so a new gesture can cancel or retarget the previous animation.
When awaiting `animation.finished`, handle rejection on cancellation. Guard cleanup
against stale animation instances. Persist the intended final styles in application
state and release finished animations instead of accumulating `fill: 'forwards'`
effects. Check reduced motion before starting and respond to preference changes.

## Stagger

Stagger is decoration, not a prerequisite for interaction. Keep offsets tight—roughly
30–60ms within the house band—and never gate input on the last item. Drop it under
reduced motion. For unknown list lengths, derive a delay from an item index rather
than writing an unbounded selector list.

## Main-thread traps

Per-frame JavaScript can compete with hydration, input, and other main-thread work.
Use CSS for predetermined motion; use JavaScript only when live input determines the
target, and write directly to the moving element's `transform` or `opacity`. Be wary
of updating an inheritable custom property on a large container: every descendant
that may read it can need style recalculation. Layout/FLIP work is a valid escape hatch
when geometry must change, but measure it and keep the affected region small.

## Platform sources

Use these for API semantics and compatibility, not as evidence for the house timing values:

- [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)
- [Animation completion and cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)
