# gcp-css

[![skills.sh](https://skills.sh/b/stopsopa/gcp-css)](https://skills.sh/stopsopa/gcp-css)

Home of **gcp-css**: one CSS file that makes plain HTML forms look like Google Cloud Platform console forms. No JavaScript, no build step. "Framework" is too big a word for it; it is a single stylesheet with a small markup contract.

This repository holds two things:

- **the stylesheet** — [`gcp-css/gcp-css.css`](gcp-css/gcp-css.css)
- **an agent skill** — [`gcp-css/SKILL.md`](gcp-css/SKILL.md), which teaches AI coding assistants how to write HTML for it

## Use the stylesheet

```html
<link rel="stylesheet" href="https://stopsopa.github.io/gcp-css/gcp-css/gcp-css.css" />

<form class="gcp-css">
  <div class="input-wrapper">
    <input type="text" id="name" name="name" placeholder=" " />
    <label for="name">Project name</label>
  </div>
  <button type="submit">Create</button>
</form>
```

Live demo with every component in every state: <https://stopsopa.github.io/gcp-css/>

## Install the skill

Via [skills.sh](https://www.skills.sh/):

```sh
npx skills add stopsopa/gcp-css
```

This needs Node.js. The CLI asks which coding agents to install it for (Claude Code, Cursor, Codex...) and whether to install it for the current project or globally. The same thing without questions:

```sh
# into the current project, for Claude Code
npx skills add stopsopa/gcp-css --skill gcp-css -a claude-code -y

# globally (available in every project)
npx skills add stopsopa/gcp-css --skill gcp-css -a claude-code -g -y

# only show what the repository offers, install nothing
npx skills add stopsopa/gcp-css --list
```

Manual install, without the CLI: copy the whole [`gcp-css/`](gcp-css) directory into the skills directory of your agent, for example `.claude/skills/gcp-css/` in a project or `~/.claude/skills/gcp-css/` for Claude Code globally.

After that, ask the assistant for a "gcp css form" or a "gcp style form" and it will pick the skill up.

The skill directory ships the stylesheet next to `SKILL.md`, so the assistant has the source of truth at hand.

## Repository layout

| Path                   | What it is                                               |
| ---------------------- | -------------------------------------------------------- |
| `gcp-css/gcp-css.css`  | the library                                              |
| `gcp-css/SKILL.md`     | the skill (how to use the library)                       |
| `skills.sh.json`       | tells the `skills` CLI where the skill lives             |
| `index.html`           | demo page, `index.ts` / `index.js` is its script         |
| `index.md`             | notes for developing the library and the demo            |
| `SUGGESTED_CHANGES.md` | review log                                               |
| `THINGS_TO_ADD.md`     | ideas, nothing in it is implemented                      |

## Background

gcp-css grew out of an experiment with the *floating label pattern*: a form label that sits inside an empty field and moves up to the border when the field is focused or filled, done in pure CSS. That exploration turned into this stylesheet.
