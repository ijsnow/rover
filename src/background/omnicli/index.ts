type Handler = (args: string[]) => Promise<void>;

export interface MenuItem {
  description: string;
  value: string;
}

export interface Action {
  command: string[];
  handler: Handler;
  usage?: string;
  getMenuItems?: (match: ActionMatch) => MenuItem[] | Promise<MenuItem[]>;
}

export interface ActionMatch {
  command: string;
  args: string[];
  action: Action;
}

const DEFAULT_ACTION_KEY = '<DEFAULT>';
const DELIMITER = ' ';

const buildActionMap = (actions: Action[]): Map<string, Action> => {
  const map = new Map<string, Action>();

  for (const action of actions) {
    for (const cmd of action.command) {
      map.set(cmd || DEFAULT_ACTION_KEY, action);
    }
  }

  return map;
};

export function menuItemsFromUsage({action, command}: ActionMatch): MenuItem[] {
  return [
    {
      description: action.usage,
      value: command,
    },
  ];
}

export default class OmniCli {
  public static DEFAULT = DEFAULT_ACTION_KEY;

  private actions = new Map<string, Action>();

  constructor(actions: Action[]) {
    this.actions = buildActionMap(actions);
  }

  public handleSubmit = (input: string): Promise<void> => {
    const [cmd, ...args] = input.trim().split(DELIMITER);

    let action = this.getAction(cmd);
    // If no action found, assume default action.
    if (!action) {
      action = this.actions.get(DEFAULT_ACTION_KEY);
    }

    if (!action) {
      return Promise.reject(
        new Error(`handler for command '${cmd}' not found`),
      );
    }

    return action.handler(args);
  };

  public getMatch(input: string): ActionMatch | null {
    const [command, ...args] = input.trim().split(DELIMITER);
    const action = this.getAction(command);
    if (action) {
      return {command, action, args};
    }

    return null;
  }

  public getCommands(): string[] {
    return Array.from(this.actions.keys()).filter(
      cmd => cmd !== DEFAULT_ACTION_KEY,
    );
  }

  private getAction(cmd: string): Action | null {
    return this.actions.get(cmd) || null;
  }
}
