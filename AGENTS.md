# Repository guidance

This project is maintained by `Mad7droid`.

When committing on behalf of the owner, use `Mad7droid <9110924+Mad7droid@users.noreply.github.com>` as both author and committer. Do not add AI co-author trailers or alternate owner identities. Preserve this attribution when publishing example pages. Never attribute another person's original contribution to the owner without their authorization.

The playground in `examples/` is buildless. Preserve the neutral light/dark theme tokens, system preference support, reduced-motion behavior, keyboard access, and copyable recipes. Run `npm run check`, `npm test`, and `python3 scripts/validate.py` after relevant changes. Publish only the committed `examples/` directory with `python3 scripts/publish_examples.py`.
