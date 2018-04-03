import {editOverride, getOverrides, Override} from '../../shared/storage';
import {Action, ActionMatch, MenuItem} from '../omnicli';
import Rover from '../rover';

function handler([atRaw, from, to]: string[]): Promise<void> {
  const at = parseInt(atRaw, 10);
  if (isNaN(at)) {
    return Promise.reject(new Error('input was not an integer'));
  }

  return editOverride(at, {from, to});
}

function getMenuItems(match: ActionMatch): Promise<MenuItem[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to edit',
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
        value: `${match.command} ${idx.toString()} ${override.from} ${
          override.to
        }`,
      })),
    );
  });
}

const action: Action = {
  command: ['edit', 'e'],
  getMenuItems,
  handler,
  usage: 'edit <index> <from> <to>',
};

export default action;
