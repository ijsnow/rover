import {addOverride, Override} from '../../shared/storage';
import OmniCli, {Action, menuItemsFromUsage} from '../omnicli';

function handler([from, to]: string[]): Promise<void> {
  return addOverride({from, to});
}

const action: Action = {
  command: [OmniCli.DEFAULT, 'add', 'a'],
  getMenuItems: menuItemsFromUsage,
  handler,
  usage: 'add <from> <to>',
};

export default action;
