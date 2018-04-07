import { Command, Suggestion } from 'omnicli';

import { getOverrides, Override, removeOverride } from '../../shared/storage';
import Rover from '../rover';

function action([atRaw]: string[]): void | Error {
  const at = parseInt(atRaw, 10);
  if (isNaN(at)) {
    return new Error('input was not an integer');
  }

  removeOverride(at);
}

function getSuggestions(args: string[]): Promise<Suggestion[]> {
  return getOverrides().then(overrides => {
    if (overrides.length === 0) {
      return [
        {
          description: 'No items to remove',
          content: '',
        },
      ];
    }

    const suggestions: Suggestion[] = [
      {
        description: 'remove <index>',
        content: '',
      },
    ];

    return suggestions.concat(
      overrides.map((override, idx) => ({
        description: `${override.from} -> ${override.to}`,
        content: idx.toString(),
      })),
    );
  });
}

const command: Command = {
  name: 'remove',
  alias: ['rm'],
  getSuggestions,
  action,
  description: 'remove <index>',
};

export default command;
