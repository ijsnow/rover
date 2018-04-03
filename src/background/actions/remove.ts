import {getOverrides, Override, removeOverride} from '../../shared/storage';
import {Action, ActionMatch, MenuItem} from '../omnicli';
import Rover from '../rover';

function handler([atRaw]: string[]): Promise<void> {
  const at = parseInt(atRaw, 10);
  if (isNaN(at)) {
    return Promise.reject(new Error('input was not an integer'));
  }

  return removeOverride(at);
}

function getMenuItems(match: ActionMatch): Promise<MenuItem[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to remove',
          value: match.command,
        },
      ];
    }

    const menuItems: MenuItem[] = [];
    const usage = match.action.usage;
    if (usage) {
      menuItems.push({
        description: usage,
        value: match.command,
      });
    }

    return menuItems.concat(
      overrides.map((override, idx) => ({
        description: `${override.from} -> ${override.to}`,
        value: `${match.command} ${idx.toString()}`,
      })),
    );
  });
}

const action: Action = {
  command: ['remove', 'rm'],
  getMenuItems,
  handler,
  usage: 'remove <index>',
};

export default action;
