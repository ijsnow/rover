import { Command, Suggestion } from 'omnicli';

import { editOverride, getOverrides, Override } from '../../shared/storage';
import Rover from '../rover';

function action([atRaw, from, to]: string[]): void | Error {
  const at = parseInt(atRaw, 10);
  if (isNaN(at)) {
    return new Error('input was not an integer');
  }

  editOverride(at, { from, to });
}

function getSuggestions(args: string[]): Promise<Suggestion[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to edit',
          content: '',
        },
      ];
    }

    const suggestions: Suggestion[] = [
      {
        description: 'edit <index> <from> <to>',
        content: '',
      },
    ];

    return suggestions.concat(
      overrides.map((override, idx) => ({
        description: `${override.from} -> ${override.to}`,
        content: `${idx.toString()} ${override.from} ${override.to}`,
      })),
    );
  });
}

const command: Command = {
  name: 'edit',
  alias: ['e'],
  getSuggestions,
  action,
  description: 'edit <index> <from> <to>',
};

export default command;
