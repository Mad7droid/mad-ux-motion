"""Validate the portable skill package and repository-local Markdown links."""
from pathlib import Path
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills' / 'ux-motion'
errors = []
text = (SKILL / 'SKILL.md').read_text()
match = re.match(r'\A---\n(.*?)\n---\n', text, re.S)
if not match:
    errors.append('SKILL.md needs YAML frontmatter')
else:
    fields = dict(re.findall(r'^(name|description): (.+)$', match[1], re.M))
    if fields.get('name') != SKILL.name:
        errors.append('Skill name must match its folder')
    if not fields.get('description', '').strip():
        errors.append('Skill description is missing')

for required in ('REFERENCE.md', 'agents/openai.yaml'):
    if not (SKILL / required).is_file():
        errors.append(f'Missing skill resource: {required}')
for path in ROOT.rglob('*.md'):
    if any(part.startswith('.') for part in path.relative_to(ROOT).parts):
        continue
    content = path.read_text()
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', content):
        if target.startswith(('https://', 'http://', 'mailto:', '#')):
            continue
        local = unquote(target.split('#', 1)[0])
        if not (path.parent / local).exists():
            errors.append(f'{path.relative_to(ROOT)}: broken link {target}')
    # The plain reference is deliberately readable without a Markdown link.
    if path == SKILL / 'SKILL.md' and '`REFERENCE.md`' in content:
        if not (path.parent / 'REFERENCE.md').is_file():
            errors.append('Advanced reference cannot be resolved')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print('Skill package and local documentation links are valid.')
