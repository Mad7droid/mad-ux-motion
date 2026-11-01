const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.join(__dirname, "..", "examples");

function page(name, reduced = false) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, name), "utf8"), {
    runScripts: "outside-only",
    url: `https://example.test/${name}`,
    pretendToBeVisual: true,
  });
  const w = dom.window;
  let onPreference;
  const media = {
    matches: reduced,
    addEventListener: (_, callback) => {
      onPreference = callback;
    },
  };
  w.matchMedia = () => media;
  w.ResizeObserver = class {
    observe() {}
  };
  const captures = new WeakMap();
  w.HTMLElement.prototype.setPointerCapture = function (id) {
    captures.set(this, id);
  };
  w.HTMLElement.prototype.hasPointerCapture = function (id) {
    return captures.get(this) === id;
  };
  w.HTMLElement.prototype.releasePointerCapture = function () {
    captures.delete(this);
  };
  w.DOMMatrixReadOnly = class {
    constructor(value) {
      this.m41 = Number(value.match(/translateX\(([-.\d]+)px\)/)?.[1] || 0);
    }
  };
  const $ = (selector) => w.document.querySelector(selector);
  const card = $("#drag-card");
  if (card) Object.defineProperty(card, "clientWidth", { value: 280 });
  w.eval(fs.readFileSync(path.join(root, "app.js"), "utf8"));
  return {
    dom,
    w,
    $,
    change(selector, value) {
      $(selector).value = value;
      $(selector).dispatchEvent(new w.Event("input"));
    },
    system(value) {
      media.matches = value;
      onPreference();
    },
  };
}
function pointer(p, type, x, id = 1) {
  const event = new p.w.Event(type);
  Object.assign(event, {
    pointerId: id,
    clientX: x,
    isPrimary: id === 1,
    button: 0,
  });
  p.$("#drag-card").dispatchEvent(event);
}

test("every example has a generated prompt and CSS; controls update actual configuration", () => {
  for (const name of ["index.html", "surfaces.html", "gestures.html"]) {
    const p = page(name);
    assert.equal(p.w.document.querySelectorAll("[data-example]").length, 2);
    p.change("#duration", "240");
    p.change("#easing", "standard");
    for (const prompt of p.w.document.querySelectorAll(".prompt")) {
      assert.match(prompt.value, /240ms enter, 180ms exit/);
      assert.match(prompt.value, /cubic-bezier\(0.2, 0, 0, 1\)/);
    }
    assert.equal(
      p.w.document.documentElement.style.getPropertyValue("--duration"),
      "240ms",
    );
    for (const code of p.w.document.querySelectorAll(".code"))
      assert.ok(code.value.length > 100);
    p.dom.window.close();
  }
});

test("system reduced motion cannot be bypassed; live preference changes update prompts and timing", () => {
  const p = page("index.html", true);
  assert.equal(p.w.document.documentElement.dataset.reduced, "true");
  assert.match(p.$("#prompt-toast").value, /100ms enter, 80ms exit/);
  assert.match(p.$("#code-toast").value, /translateY\(0px\)/);
  p.system(false);
  assert.equal(p.w.document.documentElement.dataset.reduced, "false");
  p.change("#motion", "reduce");
  assert.equal(p.w.document.documentElement.dataset.reduced, "true");
  p.change("#motion", "system");
  assert.equal(p.w.document.documentElement.dataset.reduced, "false");
  p.dom.window.close();
});

test("toast semantics and disclosure state settle correctly after rapid reversals", () => {
  const p = page("index.html");
  p.$("#toast-trigger").click();
  assert.equal(p.$("#toast").inert, false);
  assert.equal(p.$("#toast-announcement").textContent, "Draft published.");
  p.$("#toast-close").focus();
  p.$("#toast-close").click();
  assert.equal(p.w.document.activeElement, p.$("#toast-trigger"));
  assert.equal(p.$("#toast").inert, true);
  p.$("#toast-trigger").click();
  assert.equal(p.$("#toast").inert, false);
  assert.ok(p.$("#toast").classList.contains("is-visible"));
  p.dom.window.close();
  const s = page("surfaces.html");
  for (let i = 0; i < 3; i++) s.$("#accordion-trigger").click();
  assert.equal(s.$("#accordion-trigger").getAttribute("aria-expanded"), "true");
  assert.equal(s.$("#accordion-content").inert, false);
  assert.equal(s.$("#accordion-content").getAttribute("aria-hidden"), "false");
  s.dom.window.close();
});

test("drag cancels, ignores other pointers, and can be dismissed and reset without a gesture", () => {
  const p = page("gestures.html");
  const card = p.$("#drag-card");
  pointer(p, "pointerdown", 0);
  pointer(p, "pointermove", 80, 2);
  assert.equal(card.style.transform, "");
  pointer(p, "pointermove", 80);
  assert.equal(card.style.transform, "translateX(80px)");
  pointer(p, "pointercancel", 80);
  assert.equal(card.style.transform, "translateX(0)");
  assert.equal(card.classList.contains("is-dragging"), false);
  pointer(p, "pointerdown", 0);
  pointer(p, "pointermove", 120);
  pointer(p, "lostpointercapture", 120);
  assert.equal(card.classList.contains("is-dragging"), false);
  p.$("#drag-dismiss").click();
  assert.equal(card.inert, true);
  assert.equal(p.w.document.activeElement, p.$("#drag-reset"));
  p.$("#drag-reset").click();
  assert.equal(card.inert, false);
  assert.equal(card.style.opacity, "1");
  pointer(p, "pointerdown", 0);
  pointer(p, "pointermove", 180);
  pointer(p, "pointerup", 180);
  assert.equal(card.inert, true);
  p.dom.window.close();
});

test("copy writes the current prompt and offers selection when the clipboard is blocked", async () => {
  const p = page("index.html");
  let copied;
  Object.defineProperty(p.w.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (value) => {
        copied = value;
      },
    },
  });
  p.change("#duration", "300");
  p.$('[data-copy="prompt-press"]').click();
  await new Promise(setImmediate);
  assert.equal(copied, p.$("#prompt-press").value);
  Object.defineProperty(p.w.navigator, "clipboard", { value: undefined });
  p.$('[data-copy="prompt-toast"]').click();
  assert.equal(p.w.document.activeElement, p.$("#prompt-toast"));
  assert.equal(
    p.$("#prompt-toast").selectionEnd,
    p.$("#prompt-toast").value.length,
  );
  p.dom.window.close();
});

test('page navigation, asset links, labels and controlled regions resolve', () => {
  for (const name of ['index.html', 'surfaces.html', 'gestures.html']) {
    const p = page(name);
    const ids = [...p.w.document.querySelectorAll('[id]')].map((node) => node.id);
    assert.equal(new Set(ids).size, ids.length, `${name} has duplicate IDs`);
    for (const element of p.w.document.querySelectorAll('label[for], [aria-controls]')) {
      const target = element.getAttribute('for') || element.getAttribute('aria-controls');
      assert.ok(p.w.document.getElementById(target), `${name}: missing ${target}`);
    }
    for (const element of p.w.document.querySelectorAll('a[href], link[href], script[src]')) {
      const href = element.getAttribute('href') || element.getAttribute('src');
      if (href.startsWith('https://')) continue;
      if (href.startsWith('#')) assert.ok(p.w.document.getElementById(href.slice(1)));
      else assert.ok(fs.existsSync(path.join(root, href)), `${name}: broken link ${href}`);
    }
    p.dom.window.close();
  }
});
