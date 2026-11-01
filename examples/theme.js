// Apply appearance before the stylesheet loads, then keep the controls in sync.
(() => {
  const key = "ux-motion-theme";
  const valid = new Set(["system", "light", "dark"]);
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let choice = "system";
  try {
    const stored = window.localStorage.getItem(key);
    if (valid.has(stored)) choice = stored;
  } catch {
    // Storage may be blocked; appearance still works for this page.
  }
  function apply() {
    document.documentElement.dataset.theme =
      choice === "system" ? (system.matches ? "dark" : "light") : choice;
    document.documentElement.dataset.themePreference = choice;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === choice),
      );
    });
  }
  apply();
  system.addEventListener("change", apply);
  document.addEventListener("DOMContentLoaded", apply);
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-choice]");
    if (!button || !valid.has(button.dataset.themeChoice)) return;
    choice = button.dataset.themeChoice;
    try {
      window.localStorage.setItem(key, choice);
    } catch {
      /* Session-only fallback. */
    }
    apply();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    choice = valid.has(event.newValue) ? event.newValue : "system";
    apply();
  });
})();
