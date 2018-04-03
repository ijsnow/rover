import {addOverride, getOverrides, Override} from '../../shared/storage';
import {Action, ActionMatch, MenuItem} from '../omnicli';
import Rover from '../rover';

function handler([from, to]: string[]): Promise<void> {
  return addOverride({from, to});
}

function getMenuItems(match: ActionMatch): Promise<MenuItem[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to duplicate',
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

    let listToSuggest = overrides;

    const args = match.args;
    if (args.length > 0) {
      const [atRaw] = args;
      const at = parseInt(atRaw, 10);
      if (!isNaN(at)) {
        listToSuggest = listToSuggest.filter((override, idx) => idx === at);
      }
    }

    return menuItems.concat(
      listToSuggest.map((override, idx) => ({
        description: `[${idx}] ${override.from} -> ${override.to}`,
        // `duplicate` is just adding a new one so we should just map the suggestions there.
        value: `add ${override.from} ${override.to}`,
      })),
    );
  });
}

const action: Action = {
  command: ['duplicate', 'dup', 'd'],
  getMenuItems,
  // `handle` will only get called if they type everything out instead of using a suggestion.
  handler,
  usage: 'duplicate <from> <to>',
};

export default action;
