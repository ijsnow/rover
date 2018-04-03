import {find} from 'lodash';
import {
  addOverride,
  editOverride,
  getOverrides,
  onOverridesChanged,
  Override,
  removeOverride,
} from '../shared/storage';
import {Messager} from './messaging';
import {canceledRequest, processRequest} from './requests';

const BLOCK = '<block>';

enum ReqStatus {
  Redirecting,
  Blocked,
  Pending,
  Complete,
}

const findMatch = (overrides: Override[], url: string) =>
  find(overrides, ({from}: Override) => from === url);

interface Request {
  id: string;
  override: Override;
  status: ReqStatus;
}

export default class Rover {
  private overrides: Override[] = [];
  private isLoading = true;
  private requests = new Map<string, Request>();

  private messager = new Messager();

  constructor() {
    getOverrides().then(this.setOverrides);
    onOverridesChanged(this.setOverrides);
  }

  public handlePreRequest = ({
    url,
    requestId,
    tabId,
  }: browser.webRequest.WebRequestHeadersDetails) => {
    const match = findMatch(this.overrides, url);
    if (!match) {
      return {};
    }

    this.requests.set(requestId, {
      id: requestId,
      override: match,
      status: match.to === BLOCK ? ReqStatus.Blocked : ReqStatus.Pending,
    });

    if (match.to === BLOCK) {
      this.messager.send({
        payload: `Blocking request to ${match.from}`,
        tabId,
        type: 'info',
      });
      return canceledRequest;
    }

    return {};
  };

  public handleOutgoing = (
    details: browser.webRequest.WebRequestHeadersDetails,
  ): browser.webRequest.BlockingResponse => {
    const {url, tabId, requestId} = details;
    const match = this.requests.get(requestId);
    if (!match || (match && match.status !== ReqStatus.Pending)) {
      return {};
    }

    const {override} = match;

    this.requests.set(requestId, {...match, status: ReqStatus.Redirecting});

    this.messager.send({
      payload: `Redirecting request: ${override.from} -> ${override.to}`,
      tabId,
      type: 'info',
    });

    return processRequest(details, override.to);
  };

  public handleRequestCompleted = ({
    requestId,
  }: browser.webRequest.WebRequestHeadersDetails) => {
    const req = this.requests.get(requestId);
    if (req) {
      this.requests.set(requestId, {...req, status: ReqStatus.Complete});
    }
  };

  public addOverride(from: string, to: string): Promise<void> {
    return addOverride({from, to: to || BLOCK});
  }

  public editOverride(at: number, from: string, to: string): Promise<void> {
    return editOverride(at, {from, to: to || BLOCK});
  }

  public removeOverride(at: number): Promise<void> {
    return removeOverride(at);
  }

  private setOverrides = (overrides: Override[]) => {
    this.overrides = overrides;
    this.isLoading = false;
  };
}
