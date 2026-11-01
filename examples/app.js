"use strict";

const $ = (selector) => document.querySelector(selector);
const root = document.documentElement;
const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
const controls = {
  duration: $("#duration"),
  easing: $("#easing"),
  distance: $("#distance"),
  motion: $("#motion"),
};
const curves = {
  enter: ["cubic-bezier(0.05, 0.7, 0.1, 1)", "cubic-bezier(0.3, 0, 0.8, 0.15)"],
  standard: ["cubic-bezier(0.2, 0, 0, 1)", "cubic-bezier(0.2, 0, 0, 1)"],
  linear: ["linear", "linear"],
};
const recipes = {
  press: {
    name: "press feedback",
    behavior:
      "Give the save button subtle scale and color feedback on press. Preserve its position, visible focus, disabled state, and keyboard activation. Confirm the completed action separately from its motion.",
    css: (c) =>
      `.save-button {\n  transition: transform ${c.duration}ms ${c.enter},\n    background-color ${c.duration}ms ${c.enter};\n}\n.save-button:active { transform: scale(${c.reduced ? "1" : ".98"}); }\n@media (prefers-reduced-motion: reduce) {\n  .save-button:active { transform: none; }\n}`,
  },
  toast: {
    name: "a status toast",
    behavior:
      "Show confirmation with a polite live-region announcement, keep focus on the trigger, and offer explicit dismissal. Remove hidden controls from keyboard navigation. Retarget rapid show/dismiss/show changes; do not use stale timers or require transitionend to update state.",
    css: (c) =>
      `.toast {\n  opacity: 0; transform: translateY(${c.distance}px);\n  transition: opacity ${c.exitDuration}ms ${c.exit},\n    transform ${c.exitDuration}ms ${c.exit};\n}\n.toast.is-visible {\n  opacity: 1; transform: translateY(0);\n  transition-duration: ${c.duration}ms;\n  transition-timing-function: ${c.enter};\n}\n@media (prefers-reduced-motion: reduce) {\n  .toast { transform: none; }\n}`,
  },
  dialog: {
    name: "a centered settings dialog",
    behavior:
      "Use a native dialog or the existing accessible dialog primitive. Enter from scale(.96) and opacity 0. Use a shorter accelerating exit. Preserve focus placement, focus return, Tab containment, and Escape. Semantic close must not wait on decorative animation. Use progressive enhancement with instant close when discrete transitions are unavailable.",
    css: (c) =>
      `dialog {\n  opacity: 0; transform: scale(${c.reduced ? "1" : ".96"});\n  transition: opacity ${c.exitDuration}ms ${c.exit},\n    transform ${c.exitDuration}ms ${c.exit},\n    display ${c.exitDuration}ms allow-discrete,\n    overlay ${c.exitDuration}ms allow-discrete;\n}\ndialog[open] {\n  opacity: 1; transform: scale(1);\n  transition-duration: ${c.duration}ms;\n  transition-timing-function: ${c.enter};\n}\n@starting-style {\n  dialog[open] { opacity: 0; transform: scale(${c.reduced ? "1" : ".96"}); }\n}\n@media (prefers-reduced-motion: reduce) {\n  dialog { transform: none; }\n  @starting-style { dialog[open] { transform: none; } }\n}\n/* Style ::backdrop separately; see styles.css. */`,
  },
  accordion: {
    name: "an expanding disclosure",
    behavior:
      "Keep a native button with aria-expanded and aria-controls. Animate a grid wrapper from 0fr to 1fr with min-height: 0 and overflow: hidden on the inner wrapper. Make collapsed content inert. Update semantic state immediately, allow reversal, and acknowledge that intrinsic-height animation performs layout.",
    css: (c) =>
      `.disclosure {\n  display: grid; grid-template-rows: 0fr;\n  transition: grid-template-rows ${c.reduced ? "0" : c.exitDuration}ms ${c.exit};\n}\n.disclosure.is-open {\n  grid-template-rows: 1fr;\n  transition-duration: ${c.reduced ? "0" : c.duration}ms;\n  transition-timing-function: ${c.enter};\n}\n.disclosure > div { min-height: 0; overflow: hidden; }\n@media (prefers-reduced-motion: reduce) {\n  .disclosure { transition: none; }\n}`,
  },
  drag: {
    name: "a drag-to-dismiss card",
    behavior:
      "Let the card follow a single primary pointer horizontally. Use pointer capture and touch-action: pan-y, damp movement at the bounds, and dismiss at a tunable distance threshold. Clear ownership on pointercancel and lostpointercapture. Provide a keyboard-accessible dismiss button and reset. Do not overwrite positioning transforms. Under reduced motion keep direct manipulation but remove animated settling; test on physical touch hardware.",
    css: (c) =>
      `.drag-card {\n  touch-action: pan-y;\n  transition: transform ${c.reduced ? "0" : c.duration}ms ${c.enter},\n    opacity ${c.reduced ? "0" : c.duration}ms ${c.enter};\n}\n.drag-card.is-dragging { transition: none; }\n@media (prefers-reduced-motion: reduce) {\n  .drag-card { transition: none; }\n}\n/* Pointer ownership, damping, cancellation and\n   dismissal belong in JavaScript; see app.js. */`,
  },
  continuity: {
    name: "a reversible state transition",
    behavior:
      "Move a marker between two positions with CSS transform transitions. Allow repeated toggles before it finishes; retarget from the current visual position so the latest requested state wins. Keep the toggle state accessible with aria-pressed. Do not queue animations. Under reduced motion change position immediately.",
    css: (c) =>
      `.marker {\n  transform: translateX(0);\n  transition: transform ${c.reduced ? "0" : c.duration}ms ${c.enter};\n}\n.marker.at-end { transform: translateX(var(--track-distance)); }\n@media (prefers-reduced-motion: reduce) {\n  .marker { transition: none; }\n}\n/* Measure track width minus marker width and set\n   --track-distance, including on resize. */`,
  },
};

function configuration() {
  const reduced = preference.matches || controls.motion.value === "reduce";
  return {
    reduced,
    duration: reduced ? 100 : Number(controls.duration.value),
    exitDuration: reduced
      ? 80
      : Math.round(Number(controls.duration.value) * 0.75),
    distance: reduced ? 0 : Number(controls.distance.value),
    enter: curves[controls.easing.value][0],
    exit: curves[controls.easing.value][1],
  };
}

function update() {
  const c = configuration();
  root.dataset.reduced = String(c.reduced);
  root.style.setProperty("--duration", `${c.duration}ms`);
  root.style.setProperty("--exit-duration", `${c.exitDuration}ms`);
  root.style.setProperty("--travel", `${c.distance}px`);
  root.style.setProperty("--enter", c.enter);
  root.style.setProperty("--exit", c.exit);
  $("#duration-value").textContent = `${controls.duration.value} ms`;
  $("#distance-value").textContent = $("#toast")
    ? `${controls.distance.value} px`
    : "Toast only";
  $("#motion-status").textContent = c.reduced
    ? `Reduced motion active${preference.matches ? " (system preference)" : " (preview)"}. Fades: 100ms in / 80ms out; layout and settling are instant.`
    : "Full motion active. Following your system preference.";
  document.querySelectorAll("[data-example]").forEach((example) => {
    const id = example.dataset.example;
    const recipe = recipes[id];
    const relevantTravel =
      id === "toast" ? ` Use ${c.distance}px vertical travel.` : "";
    $(`#prompt-${id}`).value =
      `Use the UX Motion skill to implement ${recipe.name} in my project.\n\n${recipe.behavior}\n\nStarting configuration: ${c.duration}ms enter, ${c.exitDuration}ms exit; enter easing ${c.enter}; exit easing ${c.exit}.${relevantTravel} ${c.reduced ? "Preview reduced motion: remove nonessential travel and scale; use short fades or immediate state changes." : "Respect prefers-reduced-motion, including live preference changes."}\n\nReuse project tokens and existing primitives over these defaults. Verify keyboard behavior, rapid reversals, and reduced motion. State which browser/device checks you actually performed.`;
    $(`#code-${id}`).value = recipe.css(c);
  });
}
Object.values(controls).forEach((control) =>
  control.addEventListener("input", update),
);
preference.addEventListener("change", update);
update();
if (!$("#toast")) {
  controls.distance.disabled = true;
  $("#distance-value").textContent = "Toast only";
}

// Clipboard API works on HTTPS/localhost. Selection is the fallback for local files.
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(source.value);
      $("#copy-status").textContent =
        `${button.dataset.copy.startsWith("prompt") ? "Prompt" : "CSS"} copied.`;
      button.textContent = "Copied ✓";
    } catch {
      source.focus();
      source.select();
      $("#copy-status").textContent =
        "Text selected. Press Command+C or Control+C to copy.";
      button.textContent = "Selected · press ⌘C / Ctrl+C";
    }
  });
});

$("#save-button")?.addEventListener("click", () => {
  const count = Number($("#save-button").dataset.count || 0) + 1;
  $("#save-button").dataset.count = count;
  $("#save-status").textContent =
    `Changes saved${count > 1 ? ` · ${count}` : ""}.`;
});
function setToast(open) {
  const toast = $("#toast");
  if (!toast) return;
  if (!open && toast.contains(document.activeElement))
    $("#toast-trigger").focus();
  toast.inert = !open;
  toast.classList.toggle("is-visible", open);
  $("#toast-announcement").textContent = open ? "Draft published." : "";
}
$("#toast-trigger")?.addEventListener("click", () => setToast(true));
$("#toast-close")?.addEventListener("click", () => setToast(false));
$("#dialog-trigger")?.addEventListener("click", () =>
  $("#settings-dialog").showModal(),
);
$("#accordion-trigger")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  const panel = $("#accordion-content");
  panel.inert = !open;
  panel.setAttribute("aria-hidden", String(!open));
  panel.classList.toggle("is-open", open);
});

const marker = $("#moving-block");
if (marker) {
  const resize = new ResizeObserver(() => {
    marker.style.setProperty(
      "--track-distance",
      `${marker.parentElement.clientWidth - marker.offsetWidth}px`,
    );
  });
  resize.observe(marker.parentElement);
  $("#continuity-trigger").addEventListener("click", (event) => {
    const end = marker.classList.toggle("at-end");
    event.currentTarget.setAttribute("aria-pressed", String(end));
  });
}

const card = $("#drag-card");
if (card) {
  let pointer = null;
  let start = 0;
  let distance = 0;
  let dismissed = false;
  const resetButton = $("#drag-reset");
  const status = $("#drag-status");
  function release() {
    const old = pointer;
    pointer = null;
    card.classList.remove("is-dragging");
    if (old !== null && card.hasPointerCapture(old))
      card.releasePointerCapture(old);
  }
  function settle() {
    card.style.transform = "translateX(0)";
    distance = 0;
  }
  function dismiss() {
    release();
    dismissed = true;
    card.inert = true;
    card.style.transform = `translateX(${card.parentElement.clientWidth}px)`;
    card.style.opacity = "0";
    status.textContent = "Card dismissed. Reset to try again.";
    resetButton.focus();
  }
  card.addEventListener("pointerdown", (event) => {
    if (
      dismissed ||
      pointer !== null ||
      !event.isPrimary ||
      event.button !== 0 ||
      event.target.closest("button")
    )
      return;
    // Stop a settling transition at its visible position when a new drag starts.
    const transform = getComputedStyle(card).transform;
    const current =
      transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
    pointer = event.pointerId;
    start = event.clientX - current;
    distance = current;
    card.classList.add("is-dragging");
    card.setPointerCapture(pointer);
  });
  card.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer) return;
    const raw = event.clientX - start;
    const bound = card.clientWidth * 0.6;
    distance =
      raw < 0 ? raw * 0.15 : raw > bound ? bound + (raw - bound) * 0.2 : raw;
    card.style.transform = `translateX(${distance}px)`;
  });
  card.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointer) return;
    if (distance > card.clientWidth * 0.35) dismiss();
    else {
      release();
      settle();
      status.textContent = "Not quite far enough. Try dragging further right.";
    }
  });
  function cancel(event) {
    if (event.pointerId !== pointer) return;
    release();
    settle();
    status.textContent = "Gesture canceled. Ready to try again.";
  }
  card.addEventListener("pointercancel", cancel);
  card.addEventListener("lostpointercapture", cancel);
  $("#drag-dismiss").addEventListener("click", dismiss);
  resetButton.addEventListener("click", () => {
    release();
    dismissed = false;
    card.inert = false;
    card.style.opacity = "1";
    settle();
    status.textContent = "Try a short drag, then let go.";
  });
}
