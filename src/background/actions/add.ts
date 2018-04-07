import { Command } from 'omnicli';

import { addOverride, Override } from '../../shared/storage';

function action([from, to]: string[]) {
  addOverride({ from, to });
}

const command: Command = {
  name: 'add',
  alias: ['a'],
  action,
  description: 'add <from> <to>',
};

export default command;
