# Behavioral evaluation

These are repeatable manual scenarios for evaluating the skill, not claims of completed browser testing. Run them in a disposable project with your agent. Inspect the generated code and exercise the interaction. Record the agent, version, browser, actual result, and any failure before changing the skill.

| Scenario | Prompt / setup | Passing behavior |
| --- | --- | --- |
| Project precedence | Supply a token file using a 220ms surface duration; request a menu | Reuses the token or explains a concrete reason to depart |
| Scope | Request a server-side logging change | Does not introduce UI motion work |
| Rapid reversal | Open, close, reopen a drawer before exit completes | Latest state wins; stale cleanup does not remove the drawer |
| Reduced motion | Enable reduced motion before opening, then change it while mounted | No large travel or scale; state and focus remain correct |
| Keyboard | Open a dialog by keyboard, Escape, reopen | Focus lifecycle and dismissal work without animation delays |
| Capture loss | Drag a sheet, trigger pointer cancellation, then drag again | Drag state resets; second interaction works; scrolling is usable |
| Press transform | Polish a control already positioned with transform | Feedback preserves positioning and visible focus |
| No findings | Review a component already following project motion rules | Does not invent violations to fill the findings table |
| WAAPI cancellation | Replace a running animation, then unmount | No unhandled cancellation rejection or stale removal |

Repository CI checks skill packaging and local documentation links. It cannot establish visual smoothness, device behavior, or whether an agent follows these scenarios correctly.
