export function processRequest(
  details: browser.webRequest.WebRequestHeadersDetails,
  redirectUrl: string,
): browser.webRequest.BlockingResponse {
  console.log('building headers', details);

  console.log({redirectUrl, requestHeaders: details.requestHeaders});
  return {redirectUrl, requestHeaders: details.requestHeaders};
}

export const canceledRequest = {cancel: true};
