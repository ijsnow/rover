import find = require('lodash/find');

import { Command, createCli, Suggestion } from 'omnicli';

import {
  addOverride,
  getOverrides,
  initialize,
  Override,
} from '../shared/storage';
import add from './actions/add';
import duplicate from './actions/duplicate';
import edit from './actions/edit';
import remove from './actions/remove';
import Rover from './rover';

initialize();

const rover = new Rover();

browser.webRequest.onBeforeRequest.addListener(
  rover.handlePreRequest,
  { urls: ['<all_urls>'] },
  ['blocking'],
);

browser.webRequest.onBeforeSendHeaders.addListener(
  rover.handleOutgoing,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);

browser.webRequest.onCompleted.addListener(rover.handleRequestCompleted, {
  urls: ['<all_urls>'],
});

const commands: Command[] = [add, duplicate, edit, remove];

const cli = createCli({ commands });

browser.omnibox.onInputChanged.addListener(
  (
    text: string,
    suggest: (suggestions: browser.omnibox.SuggestResult[]) => void,
  ) => cli.onTextChanged(text).then(suggestion => suggest(suggestion)),
);

browser.omnibox.onInputEntered.addListener(cli.onTextEntered);

browser.omnibox.setDefaultSuggestion({
  description: 'Enter a command: add, edit, remove, duplicate',
});

// TODO: Url matching
//
// commands that suggest should fuzzy match with items in the list
//
// To start, pattern match for both host and path
// Eventually, add variable support like *://google.com/{0}/stuff -> *://ijsnow.me/{0}
