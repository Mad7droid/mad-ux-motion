"""Publish the committed examples tree, preserving the existing Pages history.

Unlike subtree push, this works when feature PRs have been squash merged.
Run from any directory inside this checkout after committing the examples.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def git(*args, input=None):
    return subprocess.run(
        ['git', *args], cwd=ROOT, input=input, text=True,
        check=True, stdout=subprocess.PIPE,
    ).stdout.strip()


def main():
    if git('status', '--porcelain', '--', 'examples'):
        sys.exit('Commit the examples before publishing; the examples directory has local changes.')
    git('fetch', 'origin', 'gh-pages:refs/remotes/origin/gh-pages')
    parent = git('rev-parse', 'refs/remotes/origin/gh-pages')
    tree = git('rev-parse', 'HEAD:examples')
    if git('rev-parse', f'{parent}^{{tree}}') == tree:
        print('The committed examples are already published.')
        return
    commit = git('commit-tree', tree, '-p', parent, input='Update motion playground\n')
    # A normal push rejects concurrent changes instead of overwriting them.
    git('push', 'origin', f'{commit}:refs/heads/gh-pages')
    print('Published committed examples to gh-pages. Check the GitHub Pages deployment status.')


if __name__ == '__main__':
    main()
