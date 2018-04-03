import find = require('lodash/find');
import {addOverride, getOverrides, Override} from '../shared/storage';
import add from './actions/add';
import duplicate from './actions/duplicate';
import edit from './actions/edit';
import remove from './actions/remove';
import OmniCli, {Action, ActionMatch, MenuItem} from './omnicli';
import Rover from './rover';

const rover = new Rover();

browser.webRequest.onBeforeRequest.addListener(
  rover.handlePreRequest,
  {urls: ['<all_urls>']},
  ['blocking'],
);

browser.webRequest.onBeforeSendHeaders.addListener(
  rover.handleOutgoing,
  {urls: ['<all_urls>']},
  ['blocking', 'requestHeaders'],
);

browser.webRequest.onCompleted.addListener(rover.handleRequestCompleted, {
  urls: ['<all_urls>'],
});

const actions: Action[] = [add, duplicate, edit, remove];

const cli = new OmniCli(actions);

const menuItemsToSuggestion = (items: MenuItem[]) =>
  items.map(item => ({...item, content: item.value}));

function handleInputChanged(
  text: string,
  suggest: (suggestions: browser.omnibox.SuggestResult[]) => void,
): void {
  const match = cli.getMatch(text);
  if (!match) {
    return;
  }

  const menuItems: MenuItem[] = [];

  const {action, args} = match;
  const getMenuItems = action.getMenuItems;
  if (!getMenuItems) {
    suggest(menuItemsToSuggestion(menuItems));
    return;
  }

  const gettingItems = getMenuItems(match);

  if (gettingItems instanceof Promise) {
    gettingItems.then(items => suggest(menuItemsToSuggestion(items)));
  } else {
    suggest(menuItemsToSuggestion(gettingItems));
  }
}

browser.omnibox.onInputChanged.addListener(handleInputChanged);
browser.omnibox.onInputEntered.addListener(cli.handleSubmit);

const defaultPrompt = cli
  .getCommands()
  .reduce(
    (suggestion, cmd, idx) => suggestion + (idx > 0 ? ', ' : ' ') + cmd,
    'Enter a command: ',
  );

browser.omnibox.setDefaultSuggestion({
  description: defaultPrompt,
});

// TODO: Url matching
//
// commands that suggest should fuzzy match with items in the list
//
// To start, pattern match for both host and path
// Eventually, add variable support like *://google.com/{0}/stuff -> *://ijsnow.me/{0}
