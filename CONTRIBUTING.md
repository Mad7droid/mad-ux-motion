# Contributing

Open an issue or pull request with the interaction you want to improve and why. For bugs, include a small reproduction, expected and actual behavior, browser/device, and reduced-motion setting.

Keep ordinary decision rules in `skills/ux-motion/SKILL.md`; put conditional advanced detail in `REFERENCE.md`. Put installation and contributor information in repository docs. Preserve project-token precedence and distinguish house preferences from platform requirements.

Before submitting:

```sh
python3 scripts/validate.py
```

For behavior changes, exercise the relevant scenarios in [the evaluation guide](docs/evaluation.md) and report actual results. Do not claim browser or hardware validation based on code inspection. New runtime helpers should include checks of their observable behavior. This repository does not require a Node toolchain.

Owner commits use the Mad7droid identity documented in [AGENTS.md](AGENTS.md). Project-level [Claude Code settings](https://code.claude.com/docs/en/settings-reference#attribution) disable automatic commit and PR attribution text. These settings belong to this repository; they are not part of the installable UX Motion skill.
