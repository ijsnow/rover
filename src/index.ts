import {find} from 'lodash';
import {addOverride, getOverrides, Override} from './storage';

const BLOCK = '<block>';

const handleOverrideHeaders = ({
  url,
}: browser.webRequest.WebRequestHeadersDetails): Promise<
  browser.webRequest.BlockingResponse
> =>
  getOverrides().then(overrides => {
    const match = find(overrides, ({from}: Override) => from === url);
    if (!match) {
      return {};
    }

    // TODO: Add content script that listens for things we want to log in the console like this below
    if (match.to === BLOCK) {
      // tslint:disable-next-line:no-console
      console.info(`[rover] Blocking request to ${match.from}`);
      return {cancel: true};
    }

    return {redirectUrl: match.to};
  });

browser.webRequest.onBeforeSendHeaders.addListener(
  handleOverrideHeaders,
  // TODO: Probably can create patterns out of urls from options
  {urls: ['<all_urls>']},
  ['blocking', 'requestHeaders'],
);

browser.omnibox.setDefaultSuggestion({
  description: 'Add override: <from> <to>',
});

function handleOverrideAdd(text: string) {
  const [from, to] = text.trim().split(' ');

  addOverride({from, to: to || BLOCK});
}

browser.omnibox.onInputEntered.addListener(handleOverrideAdd);

// TODO: Basic commands
// add <from> <to>
// rm <index>
//   rm should suggest the list of overrides
// edit <from> <to>
//   edit should suggest the list
// duplicate <index>
//   duplicate should suggest the list
//
// commands that suggest should fuzzy match with items in the list
//
// TODO: Url matching
//
// To start, pattern match for both host and path
// Eventually, add variable support like *://google.com/{0}/stuff -> *://ijsnow.me/{0}
