import { find } from "lodash";
import { addOverride, getOverrides, Override } from "./storage";

const handleOutgoingRequest = ({
  url
}: browser.webRequest.WebRequestHeadersDetails): Promise<
  browser.webRequest.BlockingResponse
> =>
  getOverrides().then(overrides => {
    const match = find(overrides, ({ from }: Override) => from === url);
    if (match) {
      return { redirectUrl: match.to };
    }
  });

browser.webRequest.onBeforeSendHeaders.addListener(
  handleOutgoingRequest,
  // TODO: Probably can create patters out of urls from options
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

(window as any).addOverride = addOverride;

browser.omnibox.setDefaultSuggestion({
  description: "Add override: <from> <to>"
});

function handleOverrideAdd(text: string) {
  const [from, to] = text.trim().split(" ");

  addOverride({ from, to });
}

browser.omnibox.onInputEntered.addListener(handleOverrideAdd);

// TODO: Basic commands
//
// add <from> <to>
// rm <index>
//   rm should suggest the list of overrides
// edit <from> <to>
//   edit should suggest the list
// duplicate <index>
//   duplicate should suggest the list
//
// commands that suggest should fuzzy match with items in the list
