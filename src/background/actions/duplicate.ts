import { Command, Suggestion } from 'omnicli';
import { addOverride, getOverrides, Override } from '../../shared/storage';
import Rover from '../rover';

function action([from, to]: string[]): void {
  addOverride({ from, to });
}

function getSuggestions(args: string[]): Promise<Suggestion[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to duplicate',
          content: '',
        },
      ];
    }

    const menuItems: Suggestion[] = [];
    menuItems.push({
      description: 'duplicate <from> <to>',
      content: '',
    });

    let listToSuggest = overrides;

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
        content: `add ${override.from} ${override.to}`,
      })),
    );
  });
}

const command: Command = {
  name: 'duplicate',
  alias: ['dup', 'd'],
  getSuggestions,
  // `handle` will only get called if they type everything out instead of using a suggestion.
  action,
  description: 'duplicate <from> <to>',
};

export default command;
