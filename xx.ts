// based on template: https://github.com/stopsopa/xx/blob/main/templates/xx.ts
// commands are listed by running "xx" in the root of this repository

type Command = {
  // shell script, written to xx_generated.sh and executed with /bin/bash
  command: string;
  // shown under the menu for selected row. Default: name of the command
  description?: string;
  // default true: ask "Run command?" before running
  confirm?: boolean;
  // default false. true = run in the current shell (source) instead of /bin/bash
  source?: boolean;
  // lower goes first. Missing means 0, so negative = top, positive = bottom
  order?: number;
};

type Commands = Record<string, Command>;

type Ctx = {
  // arguments given after the name of the command: xx <name> [args]
  args: string[];
  // directory xx was called in
  cwd: string;
  // path of this file
  configPath: string;
};

export default (setup: Commands, ctx: Ctx): Commands => {
  return {
    [`style:check`]: {
      command: `
set -e
NODE_OPTIONS="" ./node_modules/.bin/prettier --config prettier.config.cjs --check .
`,
      description: `prettier: fail if any file is not formatted (the same check as in github action)`,
      confirm: false,
    },
    [`style:fix`]: {
      command: `
set -e
NODE_OPTIONS="" ./node_modules/.bin/prettier --config prettier.config.cjs --write .
`,
      description: `prettier: format all files in place`,
      confirm: false,
    },
    [`style:list`]: {
      command: `
set -e
NODE_OPTIONS="" ./node_modules/.bin/prettier --config prettier.config.cjs --list-different .
`,
      description: `prettier: list files which are not formatted`,
      confirm: false,
    },

    ...setup,
  };
};
